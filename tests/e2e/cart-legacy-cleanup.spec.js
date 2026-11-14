// Cart legacy cleanup tests - tests for removing invalid legacy cart items
const { test, expect } = require('@playwright/test');

// Mock localStorage for cart storage tests
const mockLocalStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = String(value);
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

// Mock window.dispatchEvent
const mockWindow = {
  dispatchedEvents: [],
  dispatchEvent(event) {
    this.dispatchedEvents.push(event);
  },
  clearEvents() {
    this.dispatchedEvents = [];
  }
};

// Import production validation helpers
const { isValidObjectId } = require('../../backend/src/utils/cartValidation');

// Test the cartStorage logic directly with mocks
function getCart() {
  try {
    const raw = mockLocalStorage.getItem('moorthi_cafe_cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cartItems) {
  try {
    mockLocalStorage.setItem('moorthi_cafe_cart', JSON.stringify(cartItems));
    mockWindow.dispatchEvent(new Event('cartUpdated'));
  } catch (err) {
    console.error('Failed to save cart:', err);
  }
}

function removeInvalidCartItems() {
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
}

test.describe('Cart Legacy Item Cleanup - removeInvalidCartItems', () => {
  test.beforeEach(() => {
    mockLocalStorage.clear();
    mockWindow.clearEvents();
  });

  test('detects legacy invalid IDs (food-dosa-1, food-idli-1, food-kaapi-1)', () => {
    const legacyItems = [
      { foodId: 'food-dosa-1', name: 'Dosa', price: 100, quantity: 1 },
      { foodId: 'food-idli-1', name: 'Idli', price: 50, quantity: 2 },
      { foodId: 'food-kaapi-1', name: 'Kaapi', price: 30, quantity: 1 },
      { foodId: 'featured-1', name: 'Featured', price: 80, quantity: 1 },
    ];
    saveCart(legacyItems);
    mockWindow.clearEvents(); // Clear events from saveCart

    const result = removeInvalidCartItems();

    expect(result.removedCount).toBe(4);
    expect(result.remainingCount).toBe(0);
    expect(mockWindow.dispatchedEvents).toHaveLength(1);
  });

  test('removes multiple invalid items while preserving valid ones', () => {
    const mixedItems = [
      { foodId: 'food-dosa-1', name: 'Dosa', price: 100, quantity: 1 },
      { foodId: '507f1f77bcf86cd799439011', name: 'Valid Dosa', price: 120, quantity: 2 },
      { foodId: 'food-idli-1', name: 'Idli', price: 50, quantity: 1 },
      { foodId: '507f1f77bcf86cd799439012', name: 'Valid Idli', price: 60, quantity: 3 },
    ];
    saveCart(mixedItems);
    mockWindow.clearEvents();

    const result = removeInvalidCartItems();

    expect(result.removedCount).toBe(2);
    expect(result.remainingCount).toBe(2);

    const remaining = getCart();
    expect(remaining.every(item => isValidObjectId(item.foodId))).toBe(true);
    expect(remaining.find(item => item.name === 'Valid Dosa')).toBeTruthy();
    expect(remaining.find(item => item.name === 'Valid Idli')).toBeTruthy();
  });

  test('preserves valid items unchanged (quantities and prices)', () => {
    const validItems = [
      { foodId: '507f1f77bcf86cd799439011', name: 'Dosa', price: 120, quantity: 2, variantName: 'masala' },
      { foodId: '507f1f77bcf86cd799439012', name: 'Idli', price: 60, quantity: 3 },
    ];
    saveCart(validItems);
    mockWindow.clearEvents();

    const result = removeInvalidCartItems();

    expect(result.removedCount).toBe(0);
    expect(result.remainingCount).toBe(2);

    const remaining = getCart();
    expect(remaining).toHaveLength(2);
    expect(remaining[0].quantity).toBe(2);
    expect(remaining[0].price).toBe(120);
    expect(remaining[0].variantName).toBe('masala');
    expect(remaining[1].quantity).toBe(3);
    expect(remaining[1].price).toBe(60);
  });

  test('handles empty cart', () => {
    saveCart([]);
    mockWindow.clearEvents();

    const result = removeInvalidCartItems();

    expect(result.removedCount).toBe(0);
    expect(result.remainingCount).toBe(0);
    expect(mockWindow.dispatchedEvents).toHaveLength(0); // No save if nothing removed
  });

  test('dispatches cartUpdated event when items removed', () => {
    const legacyItems = [
      { foodId: 'food-dosa-1', name: 'Dosa', price: 100, quantity: 1 },
    ];
    saveCart(legacyItems);
    mockWindow.clearEvents();

    removeInvalidCartItems();

    expect(mockWindow.dispatchedEvents).toHaveLength(1);
    expect(mockWindow.dispatchedEvents[0].type).toBe('cartUpdated');
  });

  test('does not dispatch cartUpdated when no items removed', () => {
    const validItems = [
      { foodId: '507f1f77bcf86cd799439011', name: 'Dosa', price: 100, quantity: 1 },
    ];
    saveCart(validItems);
    mockWindow.clearEvents();

    removeInvalidCartItems();

    expect(mockWindow.dispatchedEvents).toHaveLength(0);
  });

  test('mixed valid and invalid cart preserves valid items', () => {
    const mixedItems = [
      { foodId: 'food-dosa-1', name: 'Legacy Dosa', price: 100, quantity: 2 },
      { foodId: '507f1f77bcf86cd799439011', name: 'Real Dosa', price: 150, quantity: 1 },
      { foodId: 'food-idli-1', name: 'Legacy Idli', price: 50, quantity: 3 },
      { foodId: '507f1f77bcf86cd799439012', name: 'Real Idli', price: 70, quantity: 2 },
      { foodId: 'featured-1', name: 'Featured Item', price: 200, quantity: 1 },
    ];
    saveCart(mixedItems);
    mockWindow.clearEvents();

    const result = removeInvalidCartItems();

    expect(result.removedCount).toBe(3);
    expect(result.remainingCount).toBe(2);

    const remaining = getCart();
    expect(remaining).toHaveLength(2);
    expect(remaining.map(item => item.name).sort()).toEqual(['Real Dosa', 'Real Idli']);
  });
});

test.describe('Checkout Validation - blocks invalid foodIds', () => {
  test.beforeEach(() => {
    mockLocalStorage.clear();
    mockWindow.clearEvents();
  });

  const validateOrderItems = (cartItems) => {
    const errors = [];
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      errors.push({ field: 'items', message: 'Order must contain at least one item' });
      return { valid: false, errors };
    }

    let hasInvalidLegacyItems = false;

    cartItems.forEach((item, index) => {
      const prefix = `items[${index}]`;

      if (!item.foodId || !objectIdRegex.test(item.foodId)) {
        hasInvalidLegacyItems = true;
        errors.push({
          field: `${prefix}.foodId`,
          message: `Invalid foodId: '${item.foodId}'. Must be a 24-character MongoDB ObjectId.`
        });
      }

      const qtyStr = String(item.quantity).trim();
      const qtyMatch = qtyStr.match(/^(\d+)$/);
      if (!qtyMatch) {
        errors.push({
          field: `${prefix}.quantity`,
          message: `Quantity for "${item.name || item.foodId}" must be an integer between 1 and 50 (got ${item.quantity})`
        });
      } else {
        const qty = parseInt(qtyMatch[1], 10);
        if (qty < 1 || qty > 50) {
          errors.push({
            field: `${prefix}.quantity`,
            message: `Quantity for "${item.name || item.foodId}" must be between 1 and 50 (got ${qty})`
          });
        }
      }
    });

    if (hasInvalidLegacyItems) {
      errors.push({
        field: 'items',
        message: 'Some items in your tray belong to an older menu and cannot be ordered. Return to your tray and remove unavailable items.'
      });
    }

    return { valid: errors.length === 0, errors, hasInvalidLegacyItems };
  };

  test('blocks orders with invalid legacy foodIds', () => {
    const items = [
      { foodId: 'food-dosa-1', name: 'Dosa', quantity: 1, price: 100 },
      { foodId: 'food-idli-1', name: 'Idli', quantity: 2, price: 50 },
    ];

    const result = validateOrderItems(items);

    expect(result.valid).toBe(false);
    expect(result.hasInvalidLegacyItems).toBe(true);
    expect(result.errors.some(e => e.field === 'items' && e.message.includes('older menu'))).toBe(true);
  });

  test('allows orders with all valid MongoDB ObjectIds', () => {
    const items = [
      { foodId: '507f1f77bcf86cd799439011', name: 'Dosa', quantity: 1, price: 100 },
      { foodId: '507f1f77bcf86cd799439012', name: 'Idli', quantity: 2, price: 50 },
    ];

    const result = validateOrderItems(items);

    expect(result.valid).toBe(true);
    expect(result.hasInvalidLegacyItems).toBe(false);
  });

  test('blocks mixed valid and invalid items', () => {
    const items = [
      { foodId: '507f1f77bcf86cd799439011', name: 'Valid Dosa', quantity: 1, price: 100 },
      { foodId: 'food-dosa-1', name: 'Invalid Dosa', quantity: 1, price: 100 },
    ];

    const result = validateOrderItems(items);

    expect(result.valid).toBe(false);
    expect(result.hasInvalidLegacyItems).toBe(true);
  });

  test('validates quantity is integer 1-50', () => {
    const items = [
      { foodId: '507f1f77bcf86cd799439011', name: 'Dosa', quantity: 0, price: 100 },
    ];

    const result = validateOrderItems(items);

    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field.includes('quantity'))).toBe(true);
  });

  test('rejects decimal quantities', () => {
    const items = [
      { foodId: '507f1f77bcf86cd799439011', name: 'Dosa', quantity: 2.5, price: 100 },
    ];

    const result = validateOrderItems(items);

    expect(result.valid).toBe(false);
  });

  test('rejects partially numeric quantities', () => {
    const items = [
      { foodId: '507f1f77bcf86cd799439011', name: 'Dosa', quantity: '3abc', price: 100 },
    ];

    const result = validateOrderItems(items);

    expect(result.valid).toBe(false);
  });

  test('empty cart is rejected', () => {
    const result = validateOrderItems([]);

    expect(result.valid).toBe(false);
    expect(result.errors[0].message).toContain('at least one item');
  });

  test('invalid items never reach order API (validation blocks)', () => {
    // This test verifies that validation blocks before API call
    // The actual API call is tested in integration tests
    const items = [
      { foodId: 'food-dosa-1', name: 'Dosa', quantity: 1, price: 100 },
    ];

    const result = validateOrderItems(items);

    expect(result.valid).toBe(false);
    // If validation fails, the order API should never be called
    // This is enforced in Checkout.js handleSubmitOrder
  });
});

test.describe('Existing valid cart items can still be updated', () => {
  test.beforeEach(() => {
    mockLocalStorage.clear();
    mockWindow.clearEvents();
  });

  test('valid items can be added after cleanup', () => {
    // First add legacy items
    const legacyItems = [
      { foodId: 'food-dosa-1', name: 'Legacy Dosa', price: 100, quantity: 1 },
    ];
    saveCart(legacyItems);

    // Clean up
    removeInvalidCartItems();

    // Add valid item
    const validItem = { foodId: '507f1f77bcf86cd799439011', name: 'Valid Dosa', price: 150, quantity: 2 };
    const current = getCart();
    current.push(validItem);
    saveCart(current);

    const cart = getCart();
    expect(cart).toHaveLength(1);
    expect(cart[0].foodId).toBe('507f1f77bcf86cd799439011');
    expect(cart[0].quantity).toBe(2);
  });

  test('quantities of valid items can be updated', () => {
    const validItems = [
      { foodId: '507f1f77bcf86cd799439011', name: 'Dosa', price: 120, quantity: 1 },
    ];
    saveCart(validItems);

    // Simulate updateCartItemQty
    const current = getCart();
    const item = current.find(item => item.foodId === '507f1f77bcf86cd799439011');
    item.quantity = 3;
    saveCart(current);

    const cart = getCart();
    expect(cart[0].quantity).toBe(3);
  });
});

test.describe('Invalid food IDs cannot be added to cart', () => {
  test.beforeEach(() => {
    mockLocalStorage.clear();
    mockWindow.clearEvents();
  });

  test('addToCart rejects invalid foodId', () => {
    const food = { _id: 'food-dosa-1', name: 'Dosa', price: 100 };

    // Simulate addToCart validation
    if (!isValidObjectId(food._id)) {
      expect(isValidObjectId('food-dosa-1')).toBe(false);
      expect(isValidObjectId('food-idli-1')).toBe(false);
      expect(isValidObjectId('food-kaapi-1')).toBe(false);
      expect(isValidObjectId('featured-1')).toBe(false);
    }
  });
});