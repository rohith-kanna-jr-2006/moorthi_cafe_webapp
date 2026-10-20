// Cart storage helper using browser localStorage
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
  const current = getCart();
  const vKey = variantName ? String(variantName).trim().toLowerCase() : '';
  const existingIdx = current.findIndex(
    (item) => item.foodId === food._id && (item.variantName || '').toLowerCase() === vKey
  );

  let price = food.price;
  if (variantName && Array.isArray(food.variants)) {
    const v = food.variants.find((vr) => vr.name.toLowerCase() === vKey);
    if (v) price = v.price;
  }

  if (existingIdx > -1) {
    current[existingIdx].quantity += quantity;
  } else {
    current.push({
      foodId: food._id,
      name: food.name,
      variantName: variantName || null,
      price: price,
      imageUrl: food.imageUrl || '',
      quantity,
    });
  }

  saveCart(current);
};

export const updateCartItemQty = (foodId, variantName, newQty) => {
  let current = getCart();
  const vKey = variantName ? String(variantName).trim().toLowerCase() : '';
  if (newQty <= 0) {
    current = current.filter(
      (item) => !(item.foodId === foodId && (item.variantName || '').toLowerCase() === vKey)
    );
  } else {
    const item = current.find(
      (it) => it.foodId === foodId && (it.variantName || '').toLowerCase() === vKey
    );
    if (item) item.quantity = newQty;
  }
  saveCart(current);
};

export const clearCart = () => {
  saveCart([]);
};
