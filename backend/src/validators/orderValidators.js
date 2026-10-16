function validateOrderPlacement(body) {
  const errors = [];
  const { items, pickupType, pickupAt, notes } = body || {};

  if (!Array.isArray(items) || items.length === 0) {
    errors.push({ field: 'items', message: 'Order must contain a non-empty array of items' });
  } else {
    items.forEach((item, index) => {
      if (!item.foodId || !item.foodId.match(/^[0-9a-fA-F]{24}$/)) {
        errors.push({ field: `items[${index}].foodId`, message: 'Valid foodId ObjectId is required' });
      }
      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty < 1 || qty > 50) {
        errors.push({ field: `items[${index}].quantity`, message: 'Quantity must be between 1 and 50' });
      }
    });
  }

  if (pickupType && !['IMMEDIATE', 'SCHEDULED'].includes(pickupType)) {
    errors.push({ field: 'pickupType', message: 'pickupType must be IMMEDIATE or SCHEDULED' });
  }

  if (pickupType === 'SCHEDULED' && !pickupAt) {
    errors.push({ field: 'pickupAt', message: 'pickupAt is required when pickupType is SCHEDULED' });
  }

  if (notes && typeof notes === 'string' && notes.length > 150) {
    errors.push({ field: 'notes', message: 'Special instructions cannot exceed 150 characters' });
  }

  return { valid: errors.length === 0, errors };
}

module.exports = {
  validateOrderPlacement,
};
