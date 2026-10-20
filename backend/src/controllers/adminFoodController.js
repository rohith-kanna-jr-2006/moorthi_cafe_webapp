const fs = require('fs');
const path = require('path');
const Food = require('../models/Food');
const Category = require('../models/Category');
const Order = require('../models/Order');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const {
  validateFood,
  validateDiscount,
  validateVariants,
  normalizeFoodBody,
  parseStrictPrice,
} = require('../validators/foodValidators');
const {
  escapeRegex,
  parsePagination,
  validateScalarString,
  validateQueryParams,
} = require('../utils/queryHelpers');
const { computeEffectivePrice, isDiscountCurrentlyActive } = require('../utils/discountCalculator');

const UPLOADS_DIR = path.resolve(__dirname, '../../public/images/uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Validates image buffer magic bytes against JPEG, PNG, and WebP signatures
 */
function detectImageType(buffer) {
  if (!buffer || buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { ext: 'jpg', mime: 'image/jpeg' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { ext: 'png', mime: 'image/png' };
  }

  // WebP: 'RIFF' .... 'WEBP'
  const riff = buffer.subarray(0, 4).toString('ascii');
  const webp = buffer.subarray(8, 12).toString('ascii');
  if (riff === 'RIFF' && webp === 'WEBP') {
    return { ext: 'webp', mime: 'image/webp' };
  }

  return null;
}

/**
 * Transforms Food document for admin response, augmenting with discount calculations & order references
 */
function enrichFoodForAdmin(foodDoc, orderCount = 0) {
  const foodObj = foodDoc.toObject ? foodDoc.toObject({ virtuals: true }) : { ...foodDoc };

  const priceCalc = computeEffectivePrice(foodObj.price, foodObj.discount);
  foodObj.effectivePrice = priceCalc.effectivePrice;
  foodObj.effectivePricePaise = priceCalc.effectivePricePaise;
  foodObj.isDiscountActive = priceCalc.isDiscountActive;
  foodObj.discountApplied = priceCalc.discountApplied;

  // Enrich variants with their effective prices
  if (Array.isArray(foodObj.variants)) {
    foodObj.variants = foodObj.variants.map((variant) => {
      let applicableDiscount = variant.discount;
      if (!isDiscountCurrentlyActive(variant.discount) && isDiscountCurrentlyActive(foodObj.discount)) {
        applicableDiscount = foodObj.discount;
      }
      const vCalc = computeEffectivePrice(variant.price, applicableDiscount);
      return {
        ...variant,
        effectivePrice: vCalc.effectivePrice,
        effectivePricePaise: vCalc.effectivePricePaise,
        isDiscountActive: vCalc.isDiscountActive,
        discountApplied: vCalc.discountApplied,
      };
    });
  }

  foodObj.hasHistoricalOrders = orderCount > 0;
  foodObj.historicalOrderCount = orderCount;

  return foodObj;
}

// @desc    List all foods for admin dashboard with full filters, pagination & discount stats
// @route   GET /api/v1/admin/foods
// @access  Private (Admin only)
const getAdminFoods = asyncHandler(async (req, res, next) => {
  validateQueryParams(req.query);
  const { page: pageNum, limit: limitNum, skip } = parsePagination(req.query, 20, 100);
  const search = validateScalarString(req.query.search, 'search', 100);
  const category = validateScalarString(req.query.category, 'category', 100);
  const isAvailable = validateScalarString(req.query.isAvailable, 'isAvailable', 10);
  const isPublished = validateScalarString(req.query.isPublished, 'isPublished', 10);
  const isArchived = validateScalarString(req.query.isArchived, 'isArchived', 10);
  const hasDiscount = validateScalarString(req.query.hasDiscount, 'hasDiscount', 10);
  const sort = validateScalarString(req.query.sort, 'sort', 30);

  const query = {};

  if (isAvailable !== undefined) {
    if (isAvailable !== 'true' && isAvailable !== 'false') {
      return next(new AppError("Query parameter 'isAvailable' must be 'true' or 'false'", 400));
    }
    query.isAvailable = isAvailable === 'true';
  }

  if (isPublished !== undefined) {
    if (isPublished !== 'true' && isPublished !== 'false') {
      return next(new AppError("Query parameter 'isPublished' must be 'true' or 'false'", 400));
    }
    query.isPublished = isPublished === 'true';
  }

  if (isArchived !== undefined) {
    if (isArchived !== 'true' && isArchived !== 'false' && isArchived !== 'all') {
      return next(new AppError("Query parameter 'isArchived' must be 'true', 'false', or 'all'", 400));
    }
    if (isArchived !== 'all') {
      query.isArchived = isArchived === 'true';
    }
  } else {
    // By default, show active/draft non-archived foods unless explicit
    query.isArchived = { $ne: true };
  }

  if (hasDiscount !== undefined) {
    if (hasDiscount === 'true') {
      query['discount.isActive'] = true;
    } else if (hasDiscount === 'false') {
      query.$or = [{ discount: { $exists: false } }, { 'discount.isActive': false }];
    }
  }

  if (category) {
    if (category.match(/^[0-9a-fA-F]{24}$/)) {
      query.category = category;
    } else {
      const foundCategory = await Category.findOne({ slug: category.toLowerCase().trim() });
      if (foundCategory) {
        query.category = foundCategory._id;
      } else {
        return res.status(200).json({
          success: true,
          message: 'No foods found for specified category',
          data: {
            foods: [],
            pagination: { total: 0, page: pageNum, limit: limitNum, pages: 0 },
          },
        });
      }
    }
  }

  if (search) {
    const escaped = escapeRegex(search);
    query.$or = [
      { name: { $regex: escaped, $options: 'i' } },
      { nameEnglish: { $regex: escaped, $options: 'i' } },
      { nameTamil: { $regex: escaped, $options: 'i' } },
      { description: { $regex: escaped, $options: 'i' } },
      { tags: { $in: [new RegExp(escaped, 'i')] } },
    ];
  }

  let sortOption = { createdAt: -1 };
  if (sort) {
    const allowedSorts = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      name: { name: 1 },
      createdAt: { createdAt: 1 },
      '-createdAt': { createdAt: -1 },
    };
    if (!allowedSorts[sort]) {
      return next(new AppError(`Invalid sort option '${sort}'. Allowed: price_asc, price_desc, name, createdAt, -createdAt`, 400));
    }
    sortOption = allowedSorts[sort];
  }

  const [foods, total] = await Promise.all([
    Food.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum),
    Food.countDocuments(query),
  ]);

  // Aggregate order references for safe delete hints
  const foodIds = foods.map((f) => f._id);
  const orderRefCounts = await Order.aggregate([
    { $unwind: '$items' },
    { $match: { 'items.food': { $in: foodIds } } },
    { $group: { _id: '$items.food', count: { $sum: 1 } } },
  ]);
  const orderCountMap = new Map(orderRefCounts.map((r) => [r._id.toString(), r.count]));

  const enrichedFoods = foods.map((food) => {
    const count = orderCountMap.get(food._id.toString()) || 0;
    return enrichFoodForAdmin(food, count);
  });

  res.status(200).json({
    success: true,
    message: 'Admin foods retrieved successfully',
    data: {
      foods: enrichedFoods,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    },
  });
});

// @desc    Get detailed food item by ID for admin
// @route   GET /api/v1/admin/foods/:id
// @access  Private (Admin only)
const getAdminFoodById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError('Invalid food ID format', 400));
  }

  const food = await Food.findById(id).populate('category', 'name slug');
  if (!food) {
    return next(new AppError('Food item not found', 404));
  }

  const orderCount = await Order.countDocuments({ 'items.food': food._id });
  const enriched = enrichFoodForAdmin(food, orderCount);

  res.status(200).json({
    success: true,
    message: 'Admin food item retrieved successfully',
    data: { food: enriched },
  });
});

// @desc    Create new food item from admin dashboard
// @route   POST /api/v1/admin/foods
// @access  Private (Admin only)
const createAdminFood = asyncHandler(async (req, res, next) => {
  normalizeFoodBody(req.body);
  const validation = validateFood(req.body);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validation.errors,
    });
  }

  const {
    name,
    nameTamil,
    nameEnglish,
    description,
    price,
    pricePaise,
    variants,
    discount,
    category,
    imageUrl,
    imageAlt,
    imageSource,
    imageLicense,
    imageStatus,
    imageType,
    isAvailable,
    isPublished,
    needsVerification,
    verificationNotes,
    isVeg,
    portion,
    prepTimeMinutes,
    tags,
  } = req.body;

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return next(new AppError('Referenced category does not exist', 404));
  }

  const finalRupeePrice = price !== undefined ? price : (pricePaise !== undefined ? pricePaise / 100 : 0);
  const finalPricePaise = pricePaise !== undefined ? pricePaise : Math.round(finalRupeePrice * 100);

  // Normalize variants with pricePaise
  const normalizedVariants = Array.isArray(variants)
    ? variants.map((v) => {
        const vPrice = Number(v.price) || 0;
        return {
          ...v,
          name: (v.name || '').trim(),
          price: vPrice,
          pricePaise: v.pricePaise !== undefined ? v.pricePaise : Math.round(vPrice * 100),
        };
      })
    : [];

  const food = await Food.create({
    name: (name || nameEnglish || '').trim(),
    nameTamil: nameTamil ? nameTamil.trim() : '',
    nameEnglish: (nameEnglish || name || '').trim(),
    description: description ? description.trim() : '',
    price: finalRupeePrice,
    pricePaise: finalPricePaise,
    variants: normalizedVariants,
    discount: discount || undefined,
    category,
    imageUrl: imageUrl ? imageUrl.trim() : '',
    imageAlt: imageAlt ? imageAlt.trim() : (name || nameEnglish || ''),
    imageSource: imageSource ? imageSource.trim() : '',
    imageLicense: imageLicense ? imageLicense.trim() : '',
    imageStatus: imageStatus || 'VERIFIED_ACTIVE',
    imageType: imageType || 'AUTHENTIC_PHOTOGRAPH',
    isAvailable: isAvailable !== undefined ? isAvailable : true,
    isPublished: isPublished !== undefined ? isPublished : false,
    needsVerification: needsVerification !== undefined ? needsVerification : false,
    verificationNotes: verificationNotes ? verificationNotes.trim() : '',
    isVeg: isVeg !== undefined ? isVeg : true,
    portion: portion ? portion.trim() : 'Standard Serving',
    prepTimeMinutes: prepTimeMinutes || 15,
    tags: Array.isArray(tags) ? tags : [],
  });

  await food.populate('category', 'name slug');
  const enriched = enrichFoodForAdmin(food, 0);

  res.status(201).json({
    success: true,
    message: 'Food item created successfully',
    data: { food: enriched },
  });
});

// @desc    Update food item from admin dashboard
// @route   PATCH /api/v1/admin/foods/:id
// @access  Private (Admin only)
const updateAdminFood = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError('Invalid food ID format', 400));
  }

  const existingFood = await Food.findById(id);
  if (!existingFood) {
    return next(new AppError('Food item not found', 404));
  }

  normalizeFoodBody(req.body);
  const { category, price, pricePaise, discount, variants } = req.body;

  if (category) {
    if (typeof category !== 'string' || !category.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new AppError('Category must be a valid 24-character hexadecimal ObjectId', 400));
    }
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return next(new AppError('Referenced category does not exist', 404));
    }
  }

  let effectiveBasePrice = existingFood.price;
  if (price !== undefined) {
    const parsedPrice = parseStrictPrice(price);
    if (parsedPrice === undefined || isNaN(parsedPrice) || parsedPrice < 0) {
      return next(new AppError('Price must be a valid non-negative number in INR (e.g. 120 or 120.50)', 400));
    }
    req.body.price = parsedPrice;
    req.body.pricePaise = Math.round(parsedPrice * 100);
    effectiveBasePrice = parsedPrice;
  } else if (pricePaise !== undefined) {
    const pPaise = parseInt(pricePaise, 10);
    if (isNaN(pPaise) || pPaise < 0) {
      return next(new AppError('pricePaise must be a valid non-negative integer', 400));
    }
    req.body.pricePaise = pPaise;
    req.body.price = pPaise / 100;
    effectiveBasePrice = pPaise / 100;
  }

  if (discount !== undefined) {
    const discountCheck = validateDiscount(discount, effectiveBasePrice);
    if (!discountCheck.valid) {
      return res.status(400).json({
        success: false,
        message: 'Discount validation failed',
        errors: discountCheck.errors,
      });
    }
  }

  if (variants !== undefined) {
    const variantCheck = validateVariants(variants);
    if (!variantCheck.valid) {
      return res.status(400).json({
        success: false,
        message: 'Variants validation failed',
        errors: variantCheck.errors,
      });
    }
    req.body.variants = variants.map((v) => {
      const vPrice = Number(v.price) || 0;
      return {
        ...v,
        price: vPrice,
        pricePaise: v.pricePaise !== undefined ? v.pricePaise : Math.round(vPrice * 100),
      };
    });
  }

  const allowedUpdates = [
    'name',
    'nameTamil',
    'nameEnglish',
    'description',
    'price',
    'pricePaise',
    'variants',
    'discount',
    'category',
    'imageUrl',
    'imageAlt',
    'imageSource',
    'imageLicense',
    'imageStatus',
    'imageType',
    'isAvailable',
    'isPublished',
    'isArchived',
    'needsVerification',
    'verificationNotes',
    'isVeg',
    'portion',
    'prepTimeMinutes',
    'tags',
  ];

  for (const field of allowedUpdates) {
    if (req.body[field] !== undefined) {
      existingFood[field] = req.body[field];
    }
  }

  await existingFood.save();
  await existingFood.populate('category', 'name slug');

  const orderCount = await Order.countDocuments({ 'items.food': existingFood._id });
  const enriched = enrichFoodForAdmin(existingFood, orderCount);

  res.status(200).json({
    success: true,
    message: 'Food item updated successfully',
    data: { food: enriched },
  });
});

// @desc    Publish or unpublish food item
// @route   PATCH /api/v1/admin/foods/:id/publish
// @access  Private (Admin only)
const setFoodPublication = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { isPublished } = req.body;

  if (typeof isPublished !== 'boolean') {
    return next(new AppError("Field 'isPublished' must be a boolean (true or false)", 400));
  }

  const food = await Food.findById(id).populate('category', 'name slug');
  if (!food) {
    return next(new AppError('Food item not found', 404));
  }

  food.isPublished = isPublished;
  await food.save();

  const orderCount = await Order.countDocuments({ 'items.food': food._id });
  const enriched = enrichFoodForAdmin(food, orderCount);

  res.status(200).json({
    success: true,
    message: `Food item '${food.name}' publication status set to ${isPublished}`,
    data: { food: enriched },
  });
});

// @desc    Update food item availability (e.g. daily 86 / sold out)
// @route   PATCH /api/v1/admin/foods/:id/availability
// @access  Private (Admin only)
const setFoodAvailability = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { isAvailable } = req.body;

  if (typeof isAvailable !== 'boolean') {
    return next(new AppError("Field 'isAvailable' must be a boolean (true or false)", 400));
  }

  const food = await Food.findById(id).populate('category', 'name slug');
  if (!food) {
    return next(new AppError('Food item not found', 404));
  }

  food.isAvailable = isAvailable;
  await food.save();

  const orderCount = await Order.countDocuments({ 'items.food': food._id });
  const enriched = enrichFoodForAdmin(food, orderCount);

  res.status(200).json({
    success: true,
    message: `Food item '${food.name}' availability set to ${isAvailable}`,
    data: { food: enriched },
  });
});

// @desc    Delete or safely archive food item
// @route   DELETE /api/v1/admin/foods/:id
// @access  Private (Admin only)
const deleteAdminFood = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError('Invalid food ID format', 400));
  }

  const food = await Food.findById(id);
  if (!food) {
    return next(new AppError('Food item not found', 404));
  }

  // Archive-Only Policy:
  // Food dishes are safely retired/archived rather than hard-deleted from MongoDB.
  // This guarantees foreign-key referential integrity for all past and in-flight orders,
  // preserves snapshots and audit trails, and eliminates orphaned references from race conditions.
  food.isArchived = true;
  food.isAvailable = false;
  food.isPublished = false;
  await food.save();

  const orderCount = await Order.countDocuments({ 'items.food': food._id });

  res.status(200).json({
    success: true,
    message: `Food item '${food.name}' has been safely archived and retired from the menu.`,
    data: {
      id: food._id,
      archived: true,
      deleted: false,
      isArchived: true,
      isAvailable: false,
      isPublished: false,
      historicalOrderCount: orderCount,
    },
  });
});

// @desc    Secure image upload or approved URL update
// @route   POST /api/v1/admin/foods/:id/image
// @access  Private (Admin only)
const uploadOrUpdateFoodImage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError('Invalid food ID format', 400));
  }

  const food = await Food.findById(id).populate('category', 'name slug');
  if (!food) {
    return next(new AppError('Food item not found', 404));
  }

  const {
    imageBase64,
    dataUrl,
    imageUrl,
    imageAlt,
    imageSource,
    imageLicense,
    imageStatus,
    imageType,
    notes,
  } = req.body;

  let finalImageUrl = food.imageUrl;
  let finalImageType = imageType || food.imageType || 'AUTHENTIC_PHOTOGRAPH';

  // 1. Base64 Upload Handling
  const rawBase64 = imageBase64 || (dataUrl ? dataUrl.replace(/^data:image\/[a-z]+;base64,/, '') : null);

  if (rawBase64) {
    const buffer = Buffer.from(rawBase64, 'base64');

    // Size limit check (max 5MB)
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (buffer.length > MAX_SIZE_BYTES) {
      return next(new AppError('Image file size exceeds maximum allowed limit of 5MB', 400));
    }

    // Magic bytes detection (JPEG, PNG, WebP)
    const detected = detectImageType(buffer);
    if (!detected) {
      return next(
        new AppError(
          'Invalid image content. Only authentic JPEG, PNG, or WebP image files are permitted.',
          400
        )
      );
    }

    // Safe filename without path traversal
    const safeFilename = `food-${food._id}-${Date.now()}.${detected.ext}`;
    const destinationPath = path.join(UPLOADS_DIR, safeFilename);

    // Verify resolved path stays strictly within UPLOADS_DIR
    if (!destinationPath.startsWith(UPLOADS_DIR)) {
      return next(new AppError('Security violation: Illegal file path detected', 400));
    }

    // Safely clean up previous upload only if no other food uses this same image
    if (food.imageUrl && food.imageUrl.startsWith('/images/uploads/')) {
      const otherFoodsUsingImage = await Food.countDocuments({
        _id: { $ne: food._id },
        imageUrl: food.imageUrl,
      });
      if (otherFoodsUsingImage === 0) {
        const oldFilename = path.basename(food.imageUrl);
        const oldFilePath = path.join(UPLOADS_DIR, oldFilename);
        if (fs.existsSync(oldFilePath)) {
          try {
            fs.unlinkSync(oldFilePath);
          } catch {
            // Ignore deletion error on old file
          }
        }
      }
    }

    fs.writeFileSync(destinationPath, buffer);
    finalImageUrl = `/images/uploads/${safeFilename}`;
    finalImageType = 'AUTHENTIC_PHOTOGRAPH';
  } else if (imageUrl) {
    // 2. Validated Image URL Handling
    const cleanUrl = imageUrl.trim();
    // Validate protocol / path (http, https, or relative /images/...)
    const isLocalRelative = cleanUrl.startsWith('/images/');
    const isHttp = /^https?:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/.test(cleanUrl);

    if (!isLocalRelative && !isHttp) {
      return next(
        new AppError(
          "Invalid imageUrl. Must be a relative path (e.g. '/images/menu/...') or valid HTTPS URL",
          400
        )
      );
    }

    // Disallow dangerous URI schemes
    if (cleanUrl.startsWith('file:') || cleanUrl.startsWith('javascript:') || cleanUrl.startsWith('data:')) {
      return next(new AppError('Security violation: Forbidden URI scheme', 400));
    }

    finalImageUrl = cleanUrl;
  } else {
    return next(new AppError("Please provide either 'imageBase64' for file upload or 'imageUrl' for verified URL", 400));
  }

  // Update image fields
  food.imageUrl = finalImageUrl;
  if (imageAlt) food.imageAlt = imageAlt.trim();
  if (imageSource) food.imageSource = imageSource.trim();
  if (imageLicense) food.imageLicense = imageLicense.trim();
  food.imageStatus = imageStatus || 'VERIFIED_ACTIVE';
  food.imageType = finalImageType;
  if (notes) food.verificationNotes = notes.trim();

  await food.save();

  const orderCount = await Order.countDocuments({ 'items.food': food._id });
  const enriched = enrichFoodForAdmin(food, orderCount);

  res.status(200).json({
    success: true,
    message: 'Food image successfully updated',
    data: { food: enriched },
  });
});

module.exports = {
  getAdminFoods,
  getAdminFoodById,
  createAdminFood,
  updateAdminFood,
  setFoodPublication,
  setFoodAvailability,
  deleteAdminFood,
  uploadOrUpdateFoodImage,
};
