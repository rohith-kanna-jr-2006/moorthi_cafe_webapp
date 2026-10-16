/**
 * Formats a clean human-readable Order Identifier matching Hotel New Moorthi Cafe conventions
 * Example: HNMC-20261015-0042
 */
function generateOrderId(businessDate, sequence) {
  const cleanDate = (businessDate || '').replace(/-/g, '');
  const seqStr = String(sequence).padStart(4, '0');
  return `HNMC-${cleanDate}-${seqStr}`;
}

module.exports = generateOrderId;
