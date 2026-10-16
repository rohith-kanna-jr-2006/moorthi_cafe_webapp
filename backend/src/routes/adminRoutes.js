const express = require('express');
const {
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
  getAdminDashboard,
  getSalesReport,
  getAdminCustomers,
} = require('../controllers/adminController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();

// Enforce both authentication AND admin role for all routes in this router
router.use(authenticate, authorize('admin'));

// Admin Dashboard & Reports
router.get('/dashboard', getAdminDashboard);
router.get('/reports/sales', getSalesReport);
router.get('/customers', getAdminCustomers);

// Admin Order Management
router.get('/orders', getAdminOrders);
router.get('/orders/:id', getAdminOrderById);
router.patch('/orders/:id/status', updateOrderStatus);

module.exports = router;
