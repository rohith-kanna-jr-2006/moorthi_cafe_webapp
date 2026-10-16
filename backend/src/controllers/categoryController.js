const Category = require('../models/Category');
const Food = require('../models/Food');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-');

// @desc    List categories (public views active only; admin views all)
// @route   GET /api/v1/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isActive: true };
  const categories = await Category.find(filter).sort({ displayOrder: 1, name: 1 });

  res.status(200).json({
    success: true,
    message: 'Categories retrieved successfully',
    data: {
      count: categories.length,
      categories,
    },
  });
});

// @desc    Get category by ID or slug
// @route   GET /api/v1/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
  const query = isObjectId ? { _id: id } : { slug: id };

  const category = await Category.findOne(query);
  if (!category) {
    return next(new AppError(`Category '${id}' not found`, 404));
  }

  res.status(200).json({
    success: true,
    message: 'Category retrieved successfully',
    data: { category },
  });
});

// @desc    Create a new category
// @route   POST /api/v1/categories
// @access  Private (Admin only)
const createCategory = asyncHandler(async (req, res, next) => {
  const { name, slug, description, displayOrder } = req.body;

  const generatedSlug = (slug || slugify(name)).toLowerCase().trim();
  const existing = await Category.findOne({ slug: generatedSlug });
  if (existing) {
    return next(new AppError(`Category with slug '${generatedSlug}' already exists`, 409));
  }

  const category = await Category.create({
    name: name.trim(),
    slug: generatedSlug,
    description: description ? description.trim() : '',
    displayOrder: displayOrder || 0,
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: { category },
  });
});

// @desc    Update category
// @route   PATCH /api/v1/categories/:id
// @access  Private (Admin only)
const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updates = { ...req.body };

  if (updates.name && !updates.slug) {
    updates.slug = slugify(updates.name);
  }

  const category = await Category.findByIdAndUpdate(id, updates, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!category) {
    return next(new AppError(`Category '${id}' not found`, 404));
  }

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: { category },
  });
});

// @desc    Delete or safely deactivate category
// @route   DELETE /api/v1/categories/:id
// @access  Private (Admin only)
const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    return next(new AppError(`Category '${id}' not found`, 404));
  }

  // Safe Deactivation Policy:
  // If foods are linked to this category, deactivate instead of breaking references.
  const linkedFoodsCount = await Food.countDocuments({ category: id });
  if (linkedFoodsCount > 0) {
    category.isActive = false;
    await category.save();

    return res.status(200).json({
      success: true,
      message: `Category has ${linkedFoodsCount} linked dishes. Safely deactivated to protect historical orders and menu integrity.`,
      data: { category, deactivated: true },
    });
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Category deleted permanently',
    data: { id, deleted: true },
  });
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
