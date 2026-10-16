function parseStrictPrice(val) {
  if (val === undefined || val === null) return undefined;
  if (typeof val === 'number') {
    if (Number.isFinite(val) && !isNaN(val) && val >= 0) {
      return Math.round(val * 100) / 100;
    }
    return NaN;
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    // Strictly require digits with optional 1-2 decimal places (rejects "120abc", "12.3.4", etc.)
    if (/^\d+(\.\d{1,2})?$/.test(trimmed)) {
      const num = Number(trimmed);
      if (Number.isFinite(num) && !isNaN(num) && num >= 0) {
        return Math.round(num * 100) / 100;
      }
    }
    return NaN;
  }
  return NaN;
}

function normalizeFoodBody(body) {
  if (!body || typeof body !== 'object') return body;
  if (!body.name && body.dishName) {
    body.name = body.dishName;
  }
  if (body.price === undefined && body.basePrice !== undefined) {
    body.price = parseStrictPrice(body.basePrice);
  } else if (body.price !== undefined) {
    body.price = parseStrictPrice(body.price);
  }
  if (!body.category && body.menuCategory) {
    body.category = body.menuCategory;
  }
  if (body.portion === undefined && body.portionSize !== undefined) {
    body.portion = body.portionSize;
  }
  if (body.prepTimeMinutes === undefined && body.prepDuration !== undefined) {
    const parsed = parseInt(body.prepDuration, 10);
    body.prepTimeMinutes = (!isNaN(parsed) && parsed > 0) ? parsed : undefined;
  }
  if (body.isVeg === undefined && body.satvikVeg !== undefined) {
    body.isVeg = body.satvikVeg;
  }
  if (body.isAvailable === undefined && body.availableForOrdering !== undefined) {
    body.isAvailable = body.availableForOrdering;
  }
  return body;
}

function validateFood(body) {
  normalizeFoodBody(body);
  const errors = [];
  const { name, price, category } = body || {};

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Dish name is required' });
  }

  if (price === undefined || typeof price !== 'number' || !Number.isFinite(price) || isNaN(price) || price < 0) {
    errors.push({ field: 'price', message: 'Price must be a valid non-negative number in INR (e.g. 120 or 120.50)' });
  }

  if (!category || typeof category !== 'string' || !category.match(/^[0-9a-fA-F]{24}$/)) {
    errors.push({ field: 'category', message: 'A valid MongoDB Category ObjectId is required' });
  }

  return { valid: errors.length === 0, errors };
}

module.exports = {
  validateFood,
  normalizeFoodBody,
  parseStrictPrice,
};
