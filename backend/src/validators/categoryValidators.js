function validateCategory(body) {
  const errors = [];
  const { name } = body || {};

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Category name is required' });
  }

  return { valid: errors.length === 0, errors };
}

module.exports = {
  validateCategory,
};
