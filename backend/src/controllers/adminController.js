const Order = require('../models/Order');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { getTodayDashboardMetrics, getDailySalesReport } = require('../services/reportService');
const { getKolkataBusinessDate } = require('../utils/dateTime');

// Controlled state transitions
const ALLOWED_TRANSITIONS = {
  PLACED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

// @desc    Get all orders for kitchen & counter management with rich filtering
// @route   GET /api/v1/admin/orders
// @access  Private (Admin only)
const getAdminOrders = asyncHandler(async (req, res) => {
  const { status, businessDate, search, page = 1, limit = 20 } = req.query;

  const query = {};

  if (status && status !== 'all') {
    query.status = status.toUpperCase();
  }

  if (businessDate) {
    query.businessDate = businessDate;
  }

  if (search && search.trim()) {
    const term = search.trim();
    // Check if searching by integer token number
    const tokenNum = parseInt(term, 10);
    if (!isNaN(tokenNum) && term === String(tokenNum)) {
      query.dailyTokenNumber = tokenNum;
    } else {
      query.$or = [
        { orderId: { $regex: term, $options: 'i' } },
        { 'items.name': { $regex: term, $options: 'i' } },
      ];
    }
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

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
  const { status, paymentStatus, note } = req.body;

  if (!status && !paymentStatus) {
    return next(new AppError('Target status or paymentStatus is required in request body', 400));
  }

  const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
  const query = isObjectId ? { _id: id } : { orderId: id.toUpperCase() };

  const order = await Order.findOne(query);
  if (!order) {
    return next(new AppError(`Order '${id}' not found`, 404));
  }

  if (paymentStatus) {
    const validPaymentStatuses = ['PENDING', 'PAID', 'REFUNDED'];
    const normalizedPaymentStatus = paymentStatus.toUpperCase();
    if (!validPaymentStatuses.includes(normalizedPaymentStatus)) {
      return next(new AppError(`Invalid paymentStatus. Allowed values: [${validPaymentStatuses.join(', ')}]`, 400));
    }
    order.paymentStatus = normalizedPaymentStatus;
  }

  if (status) {
    const nextStatus = status.toUpperCase();
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

    order.status = nextStatus;
    order.statusHistory.push({
      status: nextStatus,
      changedAt: new Date(),
      changedBy: req.user._id,
      note: note || `Status updated to ${nextStatus} by staff ${req.user.name}`,
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
const getAdminDashboard = asyncHandler(async (req, res) => {
  const businessDate = req.query.businessDate || getKolkataBusinessDate();
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
const getSalesReport = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
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
const getAdminCustomers = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  const query = { role: 'customer' };

  if (search && search.trim()) {
    const term = search.trim();
    query.$or = [
      { name: { $regex: term, $options: 'i' } },
      { email: { $regex: term, $options: 'i' } },
      { phone: { $regex: term, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

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
