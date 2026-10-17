const AppError = require('./AppError');

/**
 * Escapes characters with special meaning in regular expressions
 */
function escapeRegex(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Validates and parses pagination parameters (page, limit)
 * Rejects non-numeric, non-integer, zero, negative or malformed inputs
 */
function parsePagination(query, defaultLimit = 20, maxLimit = 100) {
  let pageNum = 1;
  let limitNum = defaultLimit;

  if (query.page !== undefined) {
    if (typeof query.page !== 'string' && typeof query.page !== 'number') {
      throw new AppError('Page must be a valid positive integer', 400);
    }
    const str = String(query.page).trim();
    if (!/^[1-9]\d*$/.test(str)) {
      throw new AppError('Page must be a valid positive integer (e.g. 1, 2, 3)', 400);
    }
    pageNum = parseInt(str, 10);
  }

  if (query.limit !== undefined) {
    if (typeof query.limit !== 'string' && typeof query.limit !== 'number') {
      throw new AppError('Limit must be a valid positive integer', 400);
    }
    const str = String(query.limit).trim();
    if (!/^[1-9]\d*$/.test(str)) {
      throw new AppError('Limit must be a valid positive integer between 1 and 100', 400);
    }
    limitNum = Math.min(maxLimit, parseInt(str, 10));
  }

  const skip = (pageNum - 1) * limitNum;
  return { page: pageNum, limit: limitNum, skip };
}

/**
 * Validates that a query parameter is a scalar string and within length bounds
 */
function validateScalarString(val, fieldName, maxLength = 100) {
  if (val === undefined || val === null) return undefined;
  if (typeof val !== 'string') {
    throw new AppError(`Query parameter '${fieldName}' must be a scalar string`, 400);
  }
  const trimmed = val.trim();
  if (trimmed.length > maxLength) {
    throw new AppError(`Query parameter '${fieldName}' cannot exceed ${maxLength} characters`, 400);
  }
  return trimmed;
}

/**
 * Validates that a date parameter matches strict YYYY-MM-DD calendar date
 */
function validateDateFormat(val, fieldName) {
  if (!val) return undefined;
  const str = validateScalarString(val, fieldName, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    throw new AppError(`Query parameter '${fieldName}' must be a valid date in YYYY-MM-DD format`, 400);
  }
  const [year, month, day] = str.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new AppError(`Query parameter '${fieldName}' is not a valid calendar date`, 400);
  }
  return str;
}

/**
 * Validates query object keys to reject brackets or array syntax injection
 */
function validateQueryParams(query) {
  if (!query || typeof query !== 'object') return;
  for (const key of Object.keys(query)) {
    if (key.includes('[') || key.includes(']')) {
      throw new AppError(`Invalid query parameter format: '${key}'`, 400);
    }
  }
}

module.exports = {
  escapeRegex,
  parsePagination,
  validateScalarString,
  validateDateFormat,
  validateQueryParams,
};
