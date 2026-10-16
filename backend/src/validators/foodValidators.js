function validateFood(body) {
  const errors = [];
  const { name, price, category } = body || {};

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Dish name is required' });
  }

  if (price === undefined || typeof price !== 'number' || price < 0) {
    errors.push({ field: 'price', message: 'Price must be a valid non-negative number in INR' });
  }

  if (!category || typeof category !== 'string' || !category.match(/^[0-9a-fA-F]{24}$/)) {
    errors.push({ field: 'category', message: 'A valid MongoDB Category ObjectId is required' });
  }

  return { valid: errors.length === 0, errors };
}

module.exports = {
  validateFood,
};
