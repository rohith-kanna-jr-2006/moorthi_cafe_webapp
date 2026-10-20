const Food = require('../models/Food');
const Category = require('../models/Category');
const Order = require('../models/Order');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { normalizeFoodBody, parseStrictPrice } = require('../validators/foodValidators');
const { escapeRegex, parsePagination, validateScalarString, validateQueryParams } = require('../utils/queryHelpers');

// @desc    List menu foods with filtering, search, and pagination
// @route   GET /api/v1/foods
// @access  Public
const getFoods = asyncHandler(async (req, res, next) => {
  validateQueryParams(req.query);
  const { page: pageNum, limit: limitNum, skip } = parsePagination(req.query, 20, 100);
  const search = validateScalarString(req.query.search, 'search', 100);
  const category = validateScalarString(req.query.category, 'category', 100);
  const isAvailable = validateScalarString(req.query.isAvailable, 'isAvailable', 10);
  const sort = validateScalarString(req.query.sort, 'sort', 30);

  const query = {};

  // Default availability and publication filters:
  // Public diners only see available, published, non-archived foods
  if (!req.user || req.user.role !== 'admin') {
    query.isAvailable = { $ne: false };
    query.isPublished = { $ne: false };
    query.isArchived = { $ne: true };
  } else {
    if (isAvailable !== undefined) {
      if (isAvailable !== 'true' && isAvailable !== 'false') {
        return next(new AppError("Query parameter 'isAvailable' must be either 'true' or 'false'", 400));
      }
      query.isAvailable = isAvailable === 'true';
    }
    if (req.query.isPublished !== undefined) {
      query.isPublished = req.query.isPublished === 'true';
    }
    if (req.query.isArchived !== undefined) {
      query.isArchived = req.query.isArchived === 'true';
    }
  }

  // Category filter: support category ObjectId or slug
  if (category) {
    if (category.match(/^[0-9a-fA-F]{24}$/)) {
      query.category = category;
    } else {
      const foundCategory = await Category.findOne({ slug: category.toLowerCase().trim() });
      if (foundCategory) {
        query.category = foundCategory._id;
      } else {
        // Category slug doesn't exist, return empty results cleanly
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

  // Search filter with literal regex escaping across English, Tamil and description
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
      return next(new AppError(`Invalid sort option '${sort}'. Allowed: price_asc, price_desc, name`, 400));
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

  res.status(200).json({
    success: true,
    message: 'Foods retrieved successfully',
    data: {
      foods,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    },
  });
});

// @desc    Get food item by ID
// @route   GET /api/v1/foods/:id
// @access  Public
const getFoodById = asyncHandler(async (req, res, next) => {
  const food = await Food.findById(req.params.id).populate('category', 'name slug');
  if (!food) {
    return next(new AppError('Food item not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Food item retrieved successfully',
    data: { food },
  });
});

// @desc    Create new food item
// @route   POST /api/v1/foods
// @access  Private (Admin only)
const createFood = asyncHandler(async (req, res, next) => {
  const {
    name,
    nameTamil,
    nameEnglish,
    description,
    price,
    pricePaise,
    variants,
    category,
    imageUrl,
    imageAlt,
    imageSource,
    imageLicense,
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

  const food = await Food.create({
    name: (name || nameEnglish || '').trim(),
    nameTamil: nameTamil ? nameTamil.trim() : '',
    nameEnglish: (nameEnglish || name || '').trim(),
    description: description ? description.trim() : '',
    price: finalRupeePrice,
    pricePaise: pricePaise !== undefined ? pricePaise : Math.round(finalRupeePrice * 100),
    variants: Array.isArray(variants) ? variants : [],
    category,
    imageUrl: imageUrl ? imageUrl.trim() : '',
    imageAlt: imageAlt ? imageAlt.trim() : (name || nameEnglish || ''),
    imageSource: imageSource ? imageSource.trim() : '',
    imageLicense: imageLicense ? imageLicense.trim() : '',
    isAvailable: isAvailable !== undefined ? isAvailable : true,
    isPublished: isPublished !== undefined ? isPublished : true,
    needsVerification: needsVerification !== undefined ? needsVerification : false,
    verificationNotes: verificationNotes ? verificationNotes.trim() : '',
    isVeg: isVeg !== undefined ? isVeg : true,
    portion: portion ? portion.trim() : 'Standard Serving',
    prepTimeMinutes: prepTimeMinutes || 15,
    tags: Array.isArray(tags) ? tags : [],
  });

  await food.populate('category', 'name slug');

  res.status(201).json({
    success: true,
    message: 'Food item created successfully',
    data: { food },
  });
});

// @desc    Update food item
// @route   PATCH /api/v1/foods/:id
// @access  Private (Admin only)
const updateFood = asyncHandler(async (req, res, next) => {
  normalizeFoodBody(req.body);
  const { category, price, pricePaise } = req.body;

  if (category) {
    if (typeof category !== 'string' || !category.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new AppError('Category must be a valid 24-character hexadecimal ObjectId', 400));
    }
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return next(new AppError('Referenced category does not exist', 404));
    }
  }

  if (price !== undefined) {
    const parsedPrice = parseStrictPrice(price);
    if (parsedPrice === undefined || isNaN(parsedPrice) || parsedPrice < 0) {
      return next(new AppError('Price must be a valid non-negative number in INR (e.g. 120 or 120.50)', 400));
    }
    req.body.price = parsedPrice;
    req.body.pricePaise = Math.round(parsedPrice * 100);
  } else if (pricePaise !== undefined) {
    const pPaise = parseInt(pricePaise, 10);
    if (isNaN(pPaise) || pPaise < 0) {
      return next(new AppError('pricePaise must be a valid non-negative integer', 400));
    }
    req.body.pricePaise = pPaise;
    req.body.price = pPaise / 100;
  }

  // Preserve partial update integrity: only update explicitly provided allowed fields
  const allowedUpdates = [
    'name',
    'nameTamil',
    'nameEnglish',
    'description',
    'price',
    'pricePaise',
    'variants',
    'category',
    'imageUrl',
    'imageAlt',
    'imageSource',
    'imageLicense',
    'imageStatus',
    'isAvailable',
    'isPublished',
    'isArchived',
    'needsVerification',
    'verificationNotes',
    'discount',
    'isVeg',
    'portion',
    'prepTimeMinutes',
    'tags',
  ];
  const updateData = {};
  for (const field of allowedUpdates) {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  }

  const food = await Food.findByIdAndUpdate(req.params.id, updateData, {
    returnDocument: 'after',
    runValidators: true,
  }).populate('category', 'name slug');

  if (!food) {
    return next(new AppError('Food item not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Food item updated successfully',
    data: { food },
  });
});

// @desc    Delete or deactivate food item
// @route   DELETE /api/v1/foods/:id
// @access  Private (Admin only)
const deleteFood = asyncHandler(async (req, res, next) => {
  const food = await Food.findById(req.params.id);
  if (!food) {
    return next(new AppError('Food item not found', 404));
  }

  // Archive-Only Policy:
  // Food dishes are safely retired/archived rather than hard-deleted from MongoDB
  // to preserve historical order snapshots and foreign-key referential integrity
  food.isArchived = true;
  food.isAvailable = false;
  food.isPublished = false;
  await food.save();

  const orderCount = await Order.countDocuments({ 'items.food': food._id });

  return res.status(200).json({
    success: true,
    message: `Food item '${food.name}' has been safely archived and retired from the menu.`,
    data: {
      food,
      archived: true,
      deleted: false,
      deactivated: true,
      isArchived: true,
      isAvailable: false,
      isPublished: false,
      historicalOrderCount: orderCount,
    },
  });
});

module.exports = {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
};
