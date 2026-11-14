// Pure validation helpers for cart quantity - no browser dependencies
// Dual CommonJS/ES module for both frontend and test environments

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

function isValidObjectId(id) {
  return typeof id === 'string' && OBJECT_ID_REGEX.test(id);
}

/**
 * Validates and normalizes a quantity input for cart operations.
 * Returns { action: 'remove' | 'update' | 'reject', qty?: number, error?: string }
 */
function validateCartQuantity(newQty) {
  // Exact zero check for removal: numeric 0 or exact string "0"
  if (newQty === 0 || newQty === '0') {
    return { action: 'remove' };
  }

  // Convert to string and trim for validation
  const qtyStr = String(newQty).trim();

  // Reject empty string
  if (qtyStr === '') {
    return { action: 'reject', error: `Quantity must be an integer between 1 and 50 (got ${newQty})` };
  }

  // Validate integer 1-50 (no decimals, no partial numerics)
  const qtyMatch = qtyStr.match(/^(\d+)$/);
  if (!qtyMatch) {
    return { action: 'reject', error: `Quantity must be an integer between 1 and 50 (got ${newQty})` };
  }

  const qty = parseInt(qtyMatch[1], 10);
  if (qty < 1 || qty > 50) {
    return { action: 'reject', error: `Quantity must be an integer between 1 and 50 (got ${qty})` };
  }

  return { action: 'update', qty };
}

// CommonJS exports for backend/tests
module.exports = {
  isValidObjectId,
  validateCartQuantity
};

// ES module exports for frontend (when imported via import())
// This is handled by webpack/babel - for Node.js require(), module.exports works