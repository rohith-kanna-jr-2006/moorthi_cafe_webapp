/**
 * Hotel New Moorthi Cafe — Discount & Effective Price Calculator
 *
 * Rules:
 * - Percentage discounts: 0 < value <= 100
 * - Fixed discounts: 0 <= value <= price (cannot exceed item price)
 * - Start/End date bounds: startsAt <= now <= endsAt
 * - Stacking policy: NO STACKING. Variant-level discount overrides item-level discount.
 * - Canonical monetary representation: integer paise (₹1 = 100 paise)
 */

function isDiscountCurrentlyActive(discount, atDate = new Date()) {
  if (!discount || !discount.isActive) return false;
  if (typeof discount.value !== 'number' || discount.value <= 0) return false;

  const checkTime = atDate instanceof Date ? atDate.getTime() : new Date(atDate).getTime();
  if (isNaN(checkTime)) return false;

  if (discount.startsAt) {
    const start = new Date(discount.startsAt).getTime();
    if (!isNaN(start) && checkTime < start) return false;
  }
  if (discount.endsAt) {
    const end = new Date(discount.endsAt).getTime();
    if (!isNaN(end) && checkTime > end) return false;
  }
  return true;
}

function computeEffectivePrice(basePriceRupees, discount, atDate = new Date()) {
  const baseRupees = Math.round((Number(basePriceRupees) || 0) * 100) / 100;
  const regularPricePaise = Math.round(baseRupees * 100);

  if (!isDiscountCurrentlyActive(discount, atDate)) {
    return {
      isDiscountActive: false,
      regularPrice: baseRupees,
      regularPricePaise,
      effectivePrice: baseRupees,
      effectivePricePaise: regularPricePaise,
      discountApplied: null,
    };
  }

  let discountAmountRupees = 0;
  if (discount.type === 'PERCENTAGE') {
    discountAmountRupees = Math.round((baseRupees * (discount.value / 100)) * 100) / 100;
  } else if (discount.type === 'FIXED_AMOUNT') {
    discountAmountRupees = Math.min(baseRupees, Math.round(Number(discount.value) * 100) / 100);
  }

  const effectivePrice = Math.max(0, Math.round((baseRupees - discountAmountRupees) * 100) / 100);
  const effectivePricePaise = Math.round(effectivePrice * 100);
  const discountAmountPaise = Math.round(discountAmountRupees * 100);

  return {
    isDiscountActive: true,
    regularPrice: baseRupees,
    regularPricePaise,
    effectivePrice,
    effectivePricePaise,
    discountApplied: {
      type: discount.type,
      value: discount.value,
      discountAmount: discountAmountRupees,
      discountAmountPaise,
    },
  };
}

module.exports = {
  isDiscountCurrentlyActive,
  computeEffectivePrice,
};
