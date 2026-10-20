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

function validateDiscount(discount, basePrice) {
  const errors = [];
  if (!discount || typeof discount !== 'object') {
    return { valid: true, errors: [] };
  }

  const { type, value, startsAt, endsAt } = discount;

  if (type !== undefined && type !== 'PERCENTAGE' && type !== 'FIXED_AMOUNT') {
    errors.push({ field: 'discount.type', message: "Discount type must be either 'PERCENTAGE' or 'FIXED_AMOUNT'" });
  }

  if (value !== undefined) {
    const numVal = Number(value);
    if (!Number.isFinite(numVal) || isNaN(numVal)) {
      errors.push({ field: 'discount.value', message: 'Discount value must be a valid number' });
    } else if (type === 'PERCENTAGE') {
      if (numVal <= 0 || numVal > 100) {
        errors.push({ field: 'discount.value', message: 'Percentage discount must be greater than 0 and at most 100%' });
      }
    } else if (type === 'FIXED_AMOUNT') {
      if (numVal < 0) {
        errors.push({ field: 'discount.value', message: 'Fixed discount must be non-negative' });
      } else if (basePrice !== undefined && numVal > basePrice) {
        errors.push({ field: 'discount.value', message: `Fixed discount (₹${numVal}) cannot exceed item price (₹${basePrice})` });
      }
    }
  }

  let startTime;
  let endTime;
  if (startsAt) {
    startTime = new Date(startsAt).getTime();
    if (isNaN(startTime)) {
      errors.push({ field: 'discount.startsAt', message: 'startsAt must be a valid date' });
    }
  }

  if (endsAt) {
    endTime = new Date(endsAt).getTime();
    if (isNaN(endTime)) {
      errors.push({ field: 'discount.endsAt', message: 'endsAt must be a valid date' });
    }
  }

  if (startTime && endTime && endTime < startTime) {
    errors.push({ field: 'discount.endsAt', message: 'endsAt cannot be earlier than startsAt' });
  }

  return { valid: errors.length === 0, errors };
}

function validateVariants(variants) {
  const errors = [];
  if (variants === undefined) return { valid: true, errors: [] };
  if (!Array.isArray(variants)) {
    return { valid: false, errors: [{ field: 'variants', message: 'Variants must be an array' }] };
  }

  const seenNames = new Set();
  for (let i = 0; i < variants.length; i++) {
    const v = variants[i];
    if (!v || typeof v !== 'object') {
      errors.push({ field: `variants[${i}]`, message: 'Variant must be an object' });
      continue;
    }
    if (!v.name || typeof v.name !== 'string' || v.name.trim().length === 0) {
      errors.push({ field: `variants[${i}].name`, message: 'Variant name is required' });
    } else {
      const lower = v.name.trim().toLowerCase();
      if (seenNames.has(lower)) {
        errors.push({ field: `variants[${i}].name`, message: `Duplicate variant name: '${v.name}'` });
      }
      seenNames.add(lower);
    }

    const price = parseStrictPrice(v.price !== undefined ? v.price : (v.pricePaise !== undefined ? v.pricePaise / 100 : undefined));
    if (price === undefined || isNaN(price) || price < 0) {
      errors.push({ field: `variants[${i}].price`, message: 'Variant price must be a valid non-negative number' });
    }

    if (v.discount) {
      const dResult = validateDiscount(v.discount, price);
      if (!dResult.valid) {
        for (const err of dResult.errors) {
          errors.push({ field: `variants[${i}].${err.field}`, message: err.message });
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateFood(body) {
  normalizeFoodBody(body);
  const errors = [];
  const { name, price, category, discount, variants } = body || {};

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Dish name is required' });
  }

  if (price === undefined || typeof price !== 'number' || !Number.isFinite(price) || isNaN(price) || price < 0) {
    errors.push({ field: 'price', message: 'Price must be a valid non-negative number in INR (e.g. 120 or 120.50)' });
  }

  if (!category || typeof category !== 'string' || !category.match(/^[0-9a-fA-F]{24}$/)) {
    errors.push({ field: 'category', message: 'A valid MongoDB Category ObjectId is required' });
  }

  if (discount) {
    const discountValidation = validateDiscount(discount, price);
    if (!discountValidation.valid) {
      errors.push(...discountValidation.errors);
    }
  }

  if (variants) {
    const variantValidation = validateVariants(variants);
    if (!variantValidation.valid) {
      errors.push(...variantValidation.errors);
    }
  }

  return { valid: errors.length === 0, errors };
}

module.exports = {
  validateFood,
  validateDiscount,
  validateVariants,
  normalizeFoodBody,
  parseStrictPrice,
};
