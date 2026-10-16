const Order = require('../models/Order');
const { placeOrder, calculateOrderPricing } = require('../services/orderService');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { parsePagination, validateScalarString, validateQueryParams } = require('../utils/queryHelpers');

// @desc    Preview pricing calculation for cart items (Subtotal, GST, Packaging, Total)
// @route   POST /api/v1/orders/preview
// @access  Public or Authenticated
const previewOrderPricing = asyncHandler(async (req, res) => {
  const { items } = req.body;
  const pricing = await calculateOrderPricing(items);

  res.status(200).json({
    success: true,
    message: 'Order pricing breakdown calculated successfully',
    data: pricing,
  });
});

// @desc    Place a new customer order
// @route   POST /api/v1/orders
// @access  Private (Authenticated Customer)
const createOrder = asyncHandler(async (req, res) => {
  const { items, pickupType, pickupAt, notes, paymentMethod } = req.body;
  const idempotencyKey = req.headers['idempotency-key'];

  const { order, isDuplicate } = await placeOrder({
    customerId: req.user._id,
    itemsInput: items,
    pickupType,
    pickupAt,
    notes,
    idempotencyKey,
    paymentMethod,
  });

  const statusCode = isDuplicate ? 200 : 201;
  const message = isDuplicate
    ? 'Order already processed (idempotent replay)'
    : 'Order placed successfully! Token issued for counter pickup';

  res.status(statusCode).json({
    success: true,
    message,
    data: { order },
  });
});

// @desc    Get currently logged in customer's order history
// @route   GET /api/v1/orders/my
// @access  Private (Authenticated Customer)
const getMyOrders = asyncHandler(async (req, res, next) => {
  validateQueryParams(req.query);
  const { page: pageNum, limit: limitNum, skip } = parsePagination(req.query, 10, 50);
  const active = validateScalarString(req.query.active, 'active', 10);
  const status = validateScalarString(req.query.status, 'status', 30);

  const query = { customer: req.user._id };

  if (active === 'true') {
    query.status = { $in: ['PLACED', 'CONFIRMED', 'PREPARING', 'READY'] };
  } else if (status) {
    const validStatuses = ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];
    const upper = status.toUpperCase();
    if (!validStatuses.includes(upper)) {
      return next(new AppError(`Invalid status filter '${status}'. Allowed: [${validStatuses.join(', ')}]`, 400));
    }
    query.status = upper;
  }

  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    message: 'Customer order history retrieved successfully',
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

// @desc    Get order details by orderId or MongoDB ObjectId
// @route   GET /api/v1/orders/:id
// @access  Private (Owner or Admin)
const getOrderById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
  const query = isObjectId ? { _id: id } : { orderId: id.toUpperCase() };

  const order = await Order.findOne(query).populate('customer', 'name phone email');

  if (!order) {
    return next(new AppError(`Order '${id}' not found`, 404));
  }

  // Ownership Check: Only the placing customer or an admin may view this order
  const isOwner = order.customer && order.customer._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return next(new AppError('Access forbidden: you do not have permission to view this order', 403));
  }

  res.status(200).json({
    success: true,
    message: 'Order retrieved successfully',
    data: { order },
  });
});

// @desc    Cancel order (Customer self-cancel permitted ONLY if still in PLACED status)
// @route   POST /api/v1/orders/:id/cancel
// @access  Private (Owner or Admin)
const cancelOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
  const query = isObjectId ? { _id: id } : { orderId: id.toUpperCase() };

  const order = await Order.findOne(query);

  if (!order) {
    return next(new AppError(`Order '${id}' not found`, 404));
  }

  const isOwner = order.customer.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return next(new AppError('Access forbidden: you cannot cancel another diner\'s order', 403));
  }

  // Cancellation Policy Rule:
  // Cannot cancel once kitchen staff has CONFIRMED or started PREPARING
  if (order.status !== 'PLACED' && !isAdmin) {
    return next(
      new AppError(
        `Cannot cancel order in '${order.status}' state. Kitchen preparation has already commenced. Please speak with counter staff directly.`,
        400
      )
    );
  }

  if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
    return next(new AppError(`Order is already ${order.status.toLowerCase()}`, 400));
  }

  order.status = 'CANCELLED';
  order.statusHistory.push({
    status: 'CANCELLED',
    changedAt: new Date(),
    changedBy: req.user._id,
    note: req.body.reason || (isAdmin ? 'Cancelled by admin staff' : 'Cancelled by customer'),
  });

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: { order },
  });
});

module.exports = {
  previewOrderPricing,
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};
