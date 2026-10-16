function normalizeFoodBody(body) {
  if (!body || typeof body !== 'object') return body;
  if (!body.name && body.dishName) {
    body.name = body.dishName;
  }
  if (body.price === undefined && body.basePrice !== undefined) {
    body.price = typeof body.basePrice === 'string' ? parseFloat(body.basePrice) : body.basePrice;
  } else if (typeof body.price === 'string' && !isNaN(parseFloat(body.price))) {
    body.price = parseFloat(body.price);
  }
  if (!body.category && body.menuCategory) {
    body.category = body.menuCategory;
  }
  if (body.portion === undefined && body.portionSize !== undefined) {
    body.portion = body.portionSize;
  }
  if (body.prepTimeMinutes === undefined && body.prepDuration !== undefined) {
    body.prepTimeMinutes = typeof body.prepDuration === 'string' ? parseInt(body.prepDuration, 10) : body.prepDuration;
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

  if (price === undefined || typeof price !== 'number' || isNaN(price) || price < 0) {
    errors.push({ field: 'price', message: 'Price must be a valid non-negative number in INR' });
  }

  if (!category || typeof category !== 'string' || !category.match(/^[0-9a-fA-F]{24}$/)) {
    errors.push({ field: 'category', message: 'A valid MongoDB Category ObjectId is required' });
  }

  return { valid: errors.length === 0, errors };
}

module.exports = {
  validateFood,
  normalizeFoodBody,
};
