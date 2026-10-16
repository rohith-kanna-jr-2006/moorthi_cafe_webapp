const Food = require('../models/Food');
const Order = require('../models/Order');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const { getKolkataBusinessDate, validatePickupTime } = require('../utils/dateTime');
const { getNextDailyToken } = require('./counterService');
const generateOrderId = require('../utils/generateOrderId');

/**
 * Calculates authoritative order pricing strictly from MongoDB Food records
 */
async function calculateOrderPricing(itemsInput) {
  if (!Array.isArray(itemsInput) || itemsInput.length === 0) {
    throw new AppError('Order must contain at least one food item', 400);
  }

  // 1. Consolidate duplicate food IDs by summing their quantities
  const aggregatedMap = new Map();
  for (const item of itemsInput) {
    const { foodId, quantity } = item;
    if (!foodId || !foodId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppError(`Invalid foodId format: '${foodId}'`, 400);
    }
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      throw new AppError(`Quantity for foodId '${foodId}' must be a positive integer`, 400);
    }
    aggregatedMap.set(foodId, (aggregatedMap.get(foodId) || 0) + qty);
  }

  const foodIds = Array.from(aggregatedMap.keys());
  const foods = await Food.find({ _id: { $in: foodIds } });

  if (foods.length !== foodIds.length) {
    const foundIds = new Set(foods.map((f) => f._id.toString()));
    const missing = foodIds.filter((id) => !foundIds.has(id));
    throw new AppError(`The following food items do not exist: ${missing.join(', ')}`, 404);
  }

  // 2. Validate availability and build line item snapshots
  const itemsSnapshot = [];
  let subtotal = 0;

  for (const food of foods) {
    if (!food.isAvailable) {
      throw new AppError(
        `'${food.name}' is currently sold out / unavailable. Please remove it from your tray to proceed.`,
        400
      );
    }

    const quantity = aggregatedMap.get(food._id.toString());
    const lineTotal = Math.round(food.price * quantity * 100) / 100;
    subtotal += lineTotal;

    itemsSnapshot.push({
      food: food._id,
      name: food.name,
      price: food.price,
      quantity,
      lineTotal,
    });
  }

  subtotal = Math.round(subtotal * 100) / 100;
  // GST calculation (5% statutory food services)
  const gst = Math.round(subtotal * (env.gstPercentage / 100) * 100) / 100;
  // Eco-friendly takeaway parcel packaging charge
  const packagingCharge = env.packagingCharge;
  const totalAmount = Math.round((subtotal + gst + packagingCharge) * 100) / 100;

  return {
    itemsSnapshot,
    subtotal,
    gst,
    packagingCharge,
    totalAmount,
  };
}

/**
 * Creates an order safely with concurrency-safe daily token allocation
 */
async function placeOrder({
  customerId,
  itemsInput,
  pickupType = 'IMMEDIATE',
  pickupAt,
  notes = '',
  idempotencyKey,
  paymentMethod = 'UPI',
}) {
  // Idempotency check: prevent duplicate submissions on client retry
  if (idempotencyKey) {
    const existingOrder = await Order.findOne({ idempotencyKey }).populate('customer', 'name phone email');
    if (existingOrder) {
      // Validate customer ownership of this idempotency key
      const existingCustomerId = existingOrder.customer?._id?.toString() || existingOrder.customer?.toString();
      if (existingCustomerId !== customerId.toString()) {
        throw new AppError('Idempotency-Key conflict: key was already used by another customer', 409);
      }

      // Validate payload consistency (items length and content comparison)
      if (Array.isArray(itemsInput)) {
        if (existingOrder.items.length !== itemsInput.length) {
          throw new AppError('Idempotency-Key conflict: key was already used for a different order payload', 409);
        }
        const existingFoodIds = new Set(existingOrder.items.map((i) => (i.food?._id || i.food).toString()));
        for (const item of itemsInput) {
          if (!existingFoodIds.has(item.foodId)) {
            throw new AppError('Idempotency-Key conflict: key was already used for a different order payload', 409);
          }
        }
      }

      return { order: existingOrder, isDuplicate: true };
    }
  }

  // 1. Calculate price from DB records
  const pricing = await calculateOrderPricing(itemsInput);

  // 2. Validate pickup timing
  let validatedPickupDate;
  if (pickupType === 'IMMEDIATE') {
    // Immediate preparation defaults to now + minimum preparation time (15 mins)
    const now = new Date();
    validatedPickupDate = new Date(now.getTime() + env.minPreparationMinutes * 60 * 1000);
  } else {
    if (!pickupAt) {
      throw new AppError('pickupAt time is required for scheduled orders', 400);
    }
    const check = validatePickupTime(pickupAt);
    if (!check.valid) {
      throw new AppError(check.message, 400);
    }
    validatedPickupDate = check.pickupDate;
  }

  const businessDate = getKolkataBusinessDate();

  // 3. Concurrency-safe atomic token allocation
  const dailyTokenNumber = await getNextDailyToken(businessDate);
  const orderId = generateOrderId(businessDate, dailyTokenNumber);

  // 4. Create Order with initial PENDING paymentStatus
  const order = await Order.create({
    orderId,
    dailyTokenNumber,
    businessDate,
    customer: customerId,
    items: pricing.itemsSnapshot,
    subtotal: pricing.subtotal,
    gst: pricing.gst,
    packagingCharge: pricing.packagingCharge,
    totalAmount: pricing.totalAmount,
    pickupType,
    pickupAt: validatedPickupDate,
    notes: (notes || '').trim(),
    status: 'PLACED',
    paymentStatus: 'PENDING',
    paymentMethod,
    idempotencyKey: idempotencyKey || undefined,
    statusHistory: [
      {
        status: 'PLACED',
        changedAt: new Date(),
        changedBy: customerId,
        note: 'Order placed by customer',
      },
    ],
  });

  await order.populate('customer', 'name phone email');

  return { order, isDuplicate: false };
}

module.exports = {
  calculateOrderPricing,
  placeOrder,
};
