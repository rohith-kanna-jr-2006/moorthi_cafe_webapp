const Food = require('../models/Food');
const Category = require('../models/Category');
const Order = require('../models/Order');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { normalizeFoodBody } = require('../validators/foodValidators');

// @desc    List menu foods with filtering, search, and pagination
// @route   GET /api/v1/foods
// @access  Public
const getFoods = asyncHandler(async (req, res) => {
  const { category, search, isAvailable, sort, page = 1, limit = 20 } = req.query;

  const query = {};

  // Availability filter: Public users only view available foods unless explicitly requested by admin
  if (isAvailable !== undefined) {
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
            pagination: { total: 0, page: 1, limit: Number(limit), pages: 0 },
          },
        });
      }
    }
  }

  // Search filter
  if (search && search.trim()) {
    query.$or = [
      { name: { $regex: search.trim(), $options: 'i' } },
      { description: { $regex: search.trim(), $options: 'i' } },
      { tags: { $in: [new RegExp(search.trim(), 'i')] } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'name') sortOption = { name: 1 };

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
  const { category } = req.body;
  if (category) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return next(new AppError('Referenced category does not exist', 404));
    }
  }

  const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
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
