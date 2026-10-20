const Food = require('../models/Food');
const Order = require('../models/Order');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const { getKolkataBusinessDate, validatePickupTime } = require('../utils/dateTime');
const { getNextDailyToken } = require('./counterService');
const generateOrderId = require('../utils/generateOrderId');

const { isDiscountCurrentlyActive, computeEffectivePrice } = require('../utils/discountCalculator');

/**
 * Calculates authoritative order pricing strictly from MongoDB Food records
 */
async function calculateOrderPricing(itemsInput) {
  if (!Array.isArray(itemsInput) || itemsInput.length === 0) {
    throw new AppError('Order must contain at least one food item', 400);
  }

  // 1. Group items by foodId AND variantName (if any)
  const aggregatedMap = new Map();
  const distinctFoodIds = new Set();

  for (const item of itemsInput) {
    const { foodId, quantity, variantName } = item;
    if (!foodId || !foodId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppError(`Invalid foodId format: '${foodId}'`, 400);
    }
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      throw new AppError(`Quantity for foodId '${foodId}' must be a positive integer`, 400);
    }
    const cleanVariant = variantName ? String(variantName).trim() : null;
    const key = `${foodId}:::${cleanVariant ? cleanVariant.toLowerCase() : ''}`;

    if (!aggregatedMap.has(key)) {
      aggregatedMap.set(key, { foodId, quantity: 0, variantName: cleanVariant });
    }
    aggregatedMap.get(key).quantity += qty;
    distinctFoodIds.add(foodId);
  }

  const foodIdList = Array.from(distinctFoodIds);
  const foods = await Food.find({ _id: { $in: foodIdList } });

  if (foods.length !== foodIdList.length) {
    const foundIds = new Set(foods.map((f) => f._id.toString()));
    const missing = foodIdList.filter((id) => !foundIds.has(id));
    throw new AppError(`The following food items do not exist: ${missing.join(', ')}`, 404);
  }

  const foodMap = new Map(foods.map((f) => [f._id.toString(), f]));

  // 2. Validate availability and build line item snapshots
  const itemsSnapshot = [];
  let subtotalPaise = 0;

  for (const [, itemData] of aggregatedMap.entries()) {
    const food = foodMap.get(itemData.foodId);
    if (!food.isAvailable || food.isPublished === false || food.isArchived === true) {
      throw new AppError(
        `'${food.name}' is currently sold out / unavailable. Please remove it from your tray to proceed.`,
        400
      );
    }

    let basePriceRupees = food.price;
    let applicableDiscount = food.discount;
    let selectedVariant = null;

    if (itemData.variantName) {
      if (!Array.isArray(food.variants) || food.variants.length === 0) {
        throw new AppError(`Dish '${food.name}' does not have any variants`, 400);
      }
      selectedVariant = food.variants.find(
        (v) => v.name.toLowerCase() === itemData.variantName.toLowerCase()
      );
      if (!selectedVariant) {
        throw new AppError(
          `Variant '${itemData.variantName}' does not exist for dish '${food.name}'`,
          400
        );
      }
      basePriceRupees = selectedVariant.price;
      // Stacking rule: Variant discount overrides dish discount if present and active
      if (selectedVariant.discount && isDiscountCurrentlyActive(selectedVariant.discount)) {
        applicableDiscount = selectedVariant.discount;
      } else {
        // Fall back to dish-level discount on the variant price
        applicableDiscount = food.discount;
      }
    }

    const priceCalc = computeEffectivePrice(basePriceRupees, applicableDiscount);
    const unitPriceRupees = priceCalc.effectivePrice;
    const unitPricePaise = priceCalc.effectivePricePaise;
    const regularPriceRupees = priceCalc.regularPrice;
    const regularPricePaise = priceCalc.regularPricePaise;
    const lineTotalPaise = unitPricePaise * itemData.quantity;
    const lineTotalRupees = lineTotalPaise / 100;

    subtotalPaise += lineTotalPaise;

    itemsSnapshot.push({
      food: food._id,
      name: food.name,
      variantName: selectedVariant ? selectedVariant.name : null,
      price: unitPriceRupees,
      pricePaise: unitPricePaise,
      originalPrice: regularPriceRupees,
      originalPricePaise: regularPricePaise,
      quantity: itemData.quantity,
      lineTotal: lineTotalRupees,
      lineTotalPaise: lineTotalPaise,
      discountApplied: priceCalc.discountApplied,
    });
  }

  const subtotal = Math.round((subtotalPaise / 100) * 100) / 100;
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
 * Compares incoming order payload with an existing order to ensure idempotency consistency
 */
function assertIdempotencyMatch(existingOrder, { customerId, itemsInput, pickupType = 'IMMEDIATE', pickupAt, notes = '', paymentMethod = 'UPI' }) {
  // 1. Cross-customer reuse check
  const existingCustomerId = existingOrder.customer?._id?.toString() || existingOrder.customer?.toString();
  if (existingCustomerId !== customerId.toString()) {
    throw new AppError('Idempotency-Key conflict: key was already used by another customer', 409);
  }

  // 2. Pickup type
  const reqPickupType = pickupType || 'IMMEDIATE';
  if (existingOrder.pickupType !== reqPickupType) {
    throw new AppError('Idempotency-Key conflict: key was already used with a different pickup type', 409);
  }

  // 3. Payment method
  const reqPaymentMethod = paymentMethod || 'UPI';
  if (existingOrder.paymentMethod !== reqPaymentMethod) {
    throw new AppError('Idempotency-Key conflict: key was already used with a different payment method', 409);
  }

  // 4. Special notes
  const reqNotes = (notes || '').trim();
  if ((existingOrder.notes || '').trim() !== reqNotes) {
    throw new AppError('Idempotency-Key conflict: key was already used with different special instructions', 409);
  }

  // 5. Scheduled pickup timing
  if (reqPickupType === 'SCHEDULED' && pickupAt) {
    const existingTime = new Date(existingOrder.pickupAt).getTime();
    const reqTime = new Date(pickupAt).getTime();
    if (Math.abs(existingTime - reqTime) > 60000) {
      throw new AppError('Idempotency-Key conflict: key was already used with a different scheduled pickup time', 409);
    }
  }

  // 6. Normalized cart items (food IDs, variants, and quantities)
  if (Array.isArray(itemsInput)) {
    const reqMap = new Map();
    for (const item of itemsInput) {
      const fid = item.foodId?.toString();
      const variant = item.variantName ? String(item.variantName).trim().toLowerCase() : '';
      const key = `${fid}:::${variant}`;
      const qty = parseInt(item.quantity, 10) || 0;
      reqMap.set(key, (reqMap.get(key) || 0) + qty);
    }

    const existMap = new Map();
    for (const item of existingOrder.items) {
      const fid = (item.food?._id || item.food).toString();
      const variant = item.variantName ? String(item.variantName).trim().toLowerCase() : '';
      const key = `${fid}:::${variant}`;
      const qty = item.quantity || 0;
      existMap.set(key, (existMap.get(key) || 0) + qty);
    }

    if (reqMap.size !== existMap.size) {
      throw new AppError('Idempotency-Key conflict: key was already used for a different order payload', 409);
    }

    for (const [key, qty] of reqMap.entries()) {
      if (existMap.get(key) !== qty) {
        throw new AppError('Idempotency-Key conflict: key was already used for a different order payload (quantity mismatch)', 409);
      }
    }
  }
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
      assertIdempotencyMatch(existingOrder, {
        customerId,
        itemsInput,
        pickupType,
        pickupAt,
        notes,
        paymentMethod,
      });
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

  // 4. Create Order with initial PENDING paymentStatus and audit history
  let order;
  try {
    order = await Order.create({
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
      paymentHistory: [
        {
          status: 'PENDING',
          changedAt: new Date(),
          method: paymentMethod,
          note: 'Order placed, awaiting counter settlement or gateway verification',
          source: 'MANUAL_COUNTER',
        },
      ],
    });
  } catch (err) {
    // Handle concurrent duplicate submission race condition without 500 error
    if (err.code === 11000 && idempotencyKey && (err.keyPattern?.idempotencyKey || (err.message && err.message.includes('idempotencyKey')))) {
      const racedOrder = await Order.findOne({ idempotencyKey }).populate('customer', 'name phone email');
      if (racedOrder) {
        assertIdempotencyMatch(racedOrder, {
          customerId,
          itemsInput,
          pickupType,
          pickupAt,
          notes,
          paymentMethod,
        });
        return { order: racedOrder, isDuplicate: true };
      }
    }
    throw err;
  }

  await order.populate('customer', 'name phone email');

  return { order, isDuplicate: false };
}

module.exports = {
  calculateOrderPricing,
  placeOrder,
};
