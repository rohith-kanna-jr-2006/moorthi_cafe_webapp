const express = require('express');
const {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} = require('../controllers/foodController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { validateFood } = require('../validators/foodValidators');

const router = express.Router();

router.get('/', getFoods);
router.get('/:id', getFoodById);

// Admin-only mutation routes
router.post('/', authenticate, authorize('admin'), validate(validateFood), createFood);
router.patch('/:id', authenticate, authorize('admin'), updateFood);
router.delete('/:id', authenticate, authorize('admin'), deleteFood);

module.exports = router;
