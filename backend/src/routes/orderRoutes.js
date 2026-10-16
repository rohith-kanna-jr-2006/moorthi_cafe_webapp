const express = require('express');
const {
  previewOrderPricing,
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require('../controllers/orderController');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { validateOrderPlacement } = require('../validators/orderValidators');

const router = express.Router();

// Preview price breakdown (can be called before submitting order)
router.post('/preview', validate(validateOrderPlacement), previewOrderPricing);

// Customer-authenticated order endpoints
router.post('/', authenticate, validate(validateOrderPlacement), createOrder);
router.get('/my', authenticate, getMyOrders);
router.get('/:id', authenticate, getOrderById);
router.post('/:id/cancel', authenticate, cancelOrder);

module.exports = router;
