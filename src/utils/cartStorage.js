// Cart storage helper using browser localStorage
import { validateCartQuantity, isValidObjectId } from './cartValidation.js';
const CART_STORAGE_KEY = 'moorthi_cafe_cart';

export const getCart = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCart = (cartItems) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (err) {
    console.error('Failed to save cart:', err);
  }
};

export const addToCart = (food, quantity = 1, variantName = null) => {
  // Validate food ID is a valid MongoDB ObjectId
  const foodId = food._id || food.id;
  if (!isValidObjectId(foodId)) {
    return { success: false, error: `Invalid foodId: '${foodId}'. Must be a 24-character MongoDB ObjectId.` };
  }

  // Validate quantity
  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty < 1 || qty > 50 || !Number.isInteger(Number(quantity))) {
    return { success: false, error: `Quantity must be an integer between 1 and 50 (got ${quantity})` };
  }

  const current = getCart();
  const vKey = variantName ? String(variantName).trim().toLowerCase() : '';
  const existingIdx = current.findIndex(
    (item) => item.foodId === foodId && (item.variantName || '').toLowerCase() === vKey
  );

  let price = food.price;
  if (variantName && Array.isArray(food.variants)) {
    const v = food.variants.find((vr) => vr.name.toLowerCase() === vKey);
    if (v) price = v.price;
  }

  if (existingIdx > -1) {
    const newQty = current[existingIdx].quantity + qty;
    if (newQty > 50) {
      return { success: false, error: `Quantity would exceed maximum of 50 (current: ${current[existingIdx].quantity}, adding: ${qty})` };
    }
    current[existingIdx].quantity = newQty;
  } else {
    current.push({
      foodId: foodId,
      name: food.name,
      variantName: variantName || null,
      price: price,
      imageUrl: food.imageUrl || '',
      quantity: qty,
    });
  }

  saveCart(current);
  return { success: true };
};

export const updateCartItemQty = (foodId, variantName, newQty) => {
  // Validate foodId
  if (!isValidObjectId(foodId)) {
    return { success: false, error: `Invalid foodId: '${foodId}'. Must be a 24-character MongoDB ObjectId.` };
  }

  const validation = validateCartQuantity(newQty);

  if (validation.action === 'reject') {
    return { success: false, error: validation.error };
  }

  if (validation.action === 'remove') {
    let current = getCart();
    const vKey = variantName ? String(variantName).trim().toLowerCase() : '';
    current = current.filter(
      (item) => !(item.foodId === foodId && (item.variantName || '').toLowerCase() === vKey)
    );
    saveCart(current);
    return { success: true };
  }

  // validation.action === 'update'
  let current = getCart();
  const vKey = variantName ? String(variantName).trim().toLowerCase() : '';
  const item = current.find(
    (it) => it.foodId === foodId && (it.variantName || '').toLowerCase() === vKey
  );
  if (item) item.quantity = validation.qty;
  saveCart(current);
  return { success: true };
};

export const clearCart = () => {
  saveCart([]);
};

// Remove invalid legacy cart items (non-MongoDB ObjectId foodIds)
export const removeInvalidCartItems = () => {
  const current = getCart();
  const validItems = current.filter(item => isValidObjectId(item.foodId));
  const removedCount = current.length - validItems.length;

  if (removedCount > 0) {
    saveCart(validItems);
  }

  return {
    removedCount,
    remainingCount: validItems.length
  };
};
