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

  // Availability filter: Public users only view available foods unless explicitly requested by admin
  if (isAvailable !== undefined) {
    if (isAvailable !== 'true' && isAvailable !== 'false') {
      return next(new AppError("Query parameter 'isAvailable' must be either 'true' or 'false'", 400));
    }
    query.isAvailable = isAvailable === 'true';
  } else if (!req.user || req.user.role !== 'admin') {
    query.isAvailable = true;
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

  // Search filter with literal regex escaping
  if (search) {
    const escaped = escapeRegex(search);
    query.$or = [
      { name: { $regex: escaped, $options: 'i' } },
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
  const { name, description, price, category, imageUrl, isAvailable, isVeg, portion, prepTimeMinutes, tags } = req.body;

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return next(new AppError('Referenced category does not exist', 404));
  }

  const food = await Food.create({
    name: name.trim(),
    description: description ? description.trim() : '',
    price,
    category,
    imageUrl: imageUrl ? imageUrl.trim() : '',
    isAvailable: isAvailable !== undefined ? isAvailable : true,
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
  const { category, price } = req.body;

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
  }

  // Preserve partial update integrity: only update explicitly provided allowed fields
  const allowedUpdates = ['name', 'description', 'price', 'category', 'imageUrl', 'isAvailable', 'isVeg', 'portion', 'prepTimeMinutes', 'tags'];
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

  // Safe Deactivation Policy:
  // If historical orders reference this food, do not hard-delete; toggle isAvailable = false
  const orderCount = await Order.countDocuments({ 'items.food': food._id });
  if (orderCount > 0) {
    food.isAvailable = false;
    await food.save();

    return res.status(200).json({
      success: true,
      message: `Food item is referenced in ${orderCount} historical orders. Safely marked unavailable to preserve order integrity.`,
      data: { food, deactivated: true },
    });
  }

  await food.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Food item permanently deleted',
    data: { id: req.params.id, deleted: true },
  });
});

module.exports = {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
};
