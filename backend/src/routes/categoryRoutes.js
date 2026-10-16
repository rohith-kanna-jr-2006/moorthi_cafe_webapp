const express = require('express');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const optionalAuth = require('../middleware/optionalAuth');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { validateCategory } = require('../validators/categoryValidators');

const router = express.Router();

router.get('/', optionalAuth, getCategories);
router.get('/:id', optionalAuth, getCategoryById);

// Admin-only mutation routes
router.post('/', authenticate, authorize('admin'), validate(validateCategory), createCategory);
router.patch('/:id', authenticate, authorize('admin'), updateCategory);
router.delete('/:id', authenticate, authorize('admin'), deleteCategory);

module.exports = router;
