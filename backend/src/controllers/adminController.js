const Order = require('../models/Order');
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

// @desc    Update order status according to strict state machine
// @route   PATCH /api/v1/admin/orders/:id/status
// @access  Private (Admin only)
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status, note } = req.body;

  if (!status) {
    return next(new AppError('Target status is required in request body', 400));
  }

  const nextStatus = status.toUpperCase();
  const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
  const query = isObjectId ? { _id: id } : { orderId: id.toUpperCase() };

  const order = await Order.findOne(query);
  if (!order) {
    return next(new AppError(`Order '${id}' not found`, 404));
  }

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

  await order.save();
  await order.populate('customer', 'name phone email');

  res.status(200).json({
    success: true,
    message: `Order #${order.orderId} (Token #${order.dailyTokenNumber}) updated to '${nextStatus}'`,
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

module.exports = {
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
  getAdminDashboard,
  getSalesReport,
};
