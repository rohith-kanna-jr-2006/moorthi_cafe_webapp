const Order = require('../models/Order');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { getTodayDashboardMetrics, getDailySalesReport } = require('../services/reportService');
const { getKolkataBusinessDate } = require('../utils/dateTime');
const { escapeRegex, parsePagination, validateScalarString, validateDateFormat, validateQueryParams } = require('../utils/queryHelpers');

// Controlled state transitions
const ALLOWED_TRANSITIONS = {
  PLACED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

const ALLOWED_PAYMENT_TRANSITIONS = {
  PENDING: ['PAID'],
  PAID: ['REFUNDED'],
  REFUNDED: [],
};

// @desc    Get all orders for kitchen & counter management with rich filtering
// @route   GET /api/v1/admin/orders
// @access  Private (Admin only)
const getAdminOrders = asyncHandler(async (req, res, next) => {
  validateQueryParams(req.query);
  const { page: pageNum, limit: limitNum, skip } = parsePagination(req.query, 20, 100);
  const status = validateScalarString(req.query.status, 'status', 30);
  const businessDate = validateDateFormat(req.query.businessDate, 'businessDate');
  const search = validateScalarString(req.query.search, 'search', 100);

  const query = {};

  if (status && status !== 'all') {
    const validStatuses = ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];
    const upperStatus = status.toUpperCase();
    if (!validStatuses.includes(upperStatus)) {
      return next(new AppError(`Invalid status filter '${status}'. Allowed: [${validStatuses.join(', ')}]`, 400));
    }
    query.status = upperStatus;
  }

  if (businessDate) {
    query.businessDate = businessDate;
  }

  if (search) {
    const term = search;
    const tokenNum = parseInt(term, 10);
    if (!isNaN(tokenNum) && term === String(tokenNum)) {
      query.dailyTokenNumber = tokenNum;
    } else {
      const escaped = escapeRegex(term);
      query.$or = [
        { orderId: { $regex: escaped, $options: 'i' } },
        { 'items.name': { $regex: escaped, $options: 'i' } },
      ];
    }
  }

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('customer', 'name phone email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    message: 'Orders retrieved successfully for admin management',
    data: {
      orders,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    },
  });
});

// @desc    Get admin single order details
// @route   GET /api/v1/admin/orders/:id
// @access  Private (Admin only)
const getAdminOrderById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
  const query = isObjectId ? { _id: id } : { orderId: id.toUpperCase() };

  const order = await Order.findOne(query).populate('customer', 'name phone email');
  if (!order) {
    return next(new AppError(`Order '${id}' not found`, 404));
  }

  res.status(200).json({
    success: true,
    message: 'Order details retrieved',
    data: { order },
  });
});

// @desc    Update order status according to strict state machine and/or paymentStatus
// @route   PATCH /api/v1/admin/orders/:id/status
// @access  Private (Admin only)
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status, paymentStatus, note, paymentMethod, paymentReference, paymentNote } = req.body;

  if (!status && !paymentStatus) {
    return next(new AppError('Target status or paymentStatus is required in request body', 400));
  }

  const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
  const query = isObjectId ? { _id: id } : { orderId: id.toUpperCase() };

  const order = await Order.findOne(query);
  if (!order) {
    return next(new AppError(`Order '${id}' not found`, 404));
  }

  // Pre-validate status transition before mutating order
  let nextStatus;
  if (status) {
    if (typeof status !== 'string') {
      return next(new AppError('Status must be a string value', 400));
    }
    nextStatus = status.toUpperCase();
    const currentStatus = order.status;
    const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];

    if (!allowed.includes(nextStatus)) {
      return next(
        new AppError(
          `Invalid status transition from '${currentStatus}' to '${nextStatus}'. Permitted transitions: [${allowed.join(', ')}]`,
          400
        )
      );
    }
  }

  // Pre-validate paymentStatus transition before mutating order
  let nextPaymentStatus;
  if (paymentStatus) {
    if (typeof paymentStatus !== 'string') {
      return next(new AppError('paymentStatus must be a string value', 400));
    }
    nextPaymentStatus = paymentStatus.toUpperCase();
    const validPaymentStatuses = ['PENDING', 'PAID', 'REFUNDED'];
    if (!validPaymentStatuses.includes(nextPaymentStatus)) {
      return next(new AppError(`Invalid paymentStatus '${paymentStatus}'. Allowed values: [${validPaymentStatuses.join(', ')}]`, 400));
    }

    const currentPaymentStatus = order.paymentStatus || 'PENDING';
    if (currentPaymentStatus === nextPaymentStatus) {
      if (currentPaymentStatus === 'PAID') {
        return next(new AppError(`Repeat settlement rejected: Order '${order.orderId}' is already marked as PAID`, 400));
      }
      return next(new AppError(`Order is already in paymentStatus '${currentPaymentStatus}'`, 400));
    }

    const allowedPayment = ALLOWED_PAYMENT_TRANSITIONS[currentPaymentStatus] || [];
    if (!allowedPayment.includes(nextPaymentStatus)) {
      return next(
        new AppError(
          `Invalid payment transition from '${currentPaymentStatus}' to '${nextPaymentStatus}'. Permitted transitions: [${allowedPayment.join(', ')}]`,
          400
        )
      );
    }

    if (paymentMethod) {
      const validMethods = ['COUNTER_CASH', 'UPI', 'CARD'];
      if (!validMethods.includes(paymentMethod.toUpperCase())) {
        return next(new AppError(`Invalid paymentMethod. Allowed: [${validMethods.join(', ')}]`, 400));
      }
    }
  }

  // Both validations passed without error: apply atomic mutations
  if (nextPaymentStatus) {
    const finalMethod = (paymentMethod ? paymentMethod.toUpperCase() : order.paymentMethod) || 'COUNTER_CASH';
    order.paymentStatus = nextPaymentStatus;
    if (nextPaymentStatus === 'PAID') {
      order.paymentSettlement = {
        settledAt: new Date(),
        settledBy: req.user._id,
        method: finalMethod,
        reference: paymentReference ? String(paymentReference).trim() : undefined,
        note: paymentNote ? String(paymentNote).trim() : (note ? String(note).trim() : `Manual counter settlement confirmed by staff ${req.user.name}`),
        source: 'MANUAL_COUNTER',
      };
    }
    order.paymentHistory.push({
      status: nextPaymentStatus,
      changedAt: new Date(),
      changedBy: req.user._id,
      method: finalMethod,
      reference: paymentReference ? String(paymentReference).trim() : undefined,
      note: paymentNote ? String(paymentNote).trim() : (note ? String(note).trim() : `Payment status changed to ${nextPaymentStatus} by staff ${req.user.name}`),
      source: 'MANUAL_COUNTER',
    });
  }

  if (nextStatus) {
    order.status = nextStatus;
    order.statusHistory.push({
      status: nextStatus,
      changedAt: new Date(),
      changedBy: req.user._id,
      note: note ? String(note).trim() : `Status updated to ${nextStatus} by staff ${req.user.name}`,
    });
  }

  await order.save();
  await order.populate('customer', 'name phone email');

  res.status(200).json({
    success: true,
    message: `Order #${order.orderId} (Token #${order.dailyTokenNumber}) updated successfully`,
    data: { order },
  });
});

// @desc    Get live operational dashboard metrics
// @route   GET /api/v1/admin/dashboard
// @access  Private (Admin only)
const getAdminDashboard = asyncHandler(async (req, res, next) => {
  let businessDate = req.query.businessDate;
  if (businessDate) {
    businessDate = validateDateFormat(businessDate, 'businessDate');
  } else {
    businessDate = getKolkataBusinessDate();
  }

  const metrics = await getTodayDashboardMetrics(businessDate);

  // Fetch 10 most recent orders for live counter queue table
  const recentOrders = await Order.find({ businessDate })
    .populate('customer', 'name phone')
    .sort({ createdAt: -1 })
    .limit(10);

  res.status(200).json({
    success: true,
    message: 'Operations and kitchen dashboard data retrieved',
    data: {
      metrics,
      recentOrders,
    },
  });
});

// @desc    Get sales and settlement report
// @route   GET /api/v1/admin/reports/sales
// @access  Private (Admin only)
const getSalesReport = asyncHandler(async (req, res, next) => {
  const from = validateDateFormat(req.query.from, 'from');
  const to = validateDateFormat(req.query.to, 'to');
  const report = await getDailySalesReport(from, to);

  res.status(200).json({
    success: true,
    message: 'Sales aggregation report generated',
    data: report,
  });
});

// @desc    Get registered customers list with order count for admin management
// @route   GET /api/v1/admin/customers
// @access  Private (Admin only)
const getAdminCustomers = asyncHandler(async (req, res, next) => {
  validateQueryParams(req.query);
  const { page: pageNum, limit: limitNum, skip } = parsePagination(req.query, 20, 100);
  const search = validateScalarString(req.query.search, 'search', 100);
  const query = { role: 'customer' };

  if (search) {
    const escaped = escapeRegex(search);
    query.$or = [
      { name: { $regex: escaped, $options: 'i' } },
      { email: { $regex: escaped, $options: 'i' } },
      { phone: { $regex: escaped, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    User.countDocuments(query),
  ]);

  const customerIds = users.map((u) => u._id);
  const orderCounts = await Order.aggregate([
    { $match: { customer: { $in: customerIds } } },
    { $group: { _id: '$customer', count: { $sum: 1 } } },
  ]);
  const countMap = new Map(orderCounts.map((c) => [c._id.toString(), c.count]));

  const customers = users.map((u) => ({
    id: u._id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    isActive: u.isActive,
    totalOrders: countMap.get(u._id.toString()) || 0,
    createdAt: u.createdAt,
  }));

  res.status(200).json({
    success: true,
    message: 'Customers retrieved successfully for admin management',
    data: {
      customers,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    },
  });
});

module.exports = {
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
  getAdminDashboard,
  getSalesReport,
  getAdminCustomers,
};
