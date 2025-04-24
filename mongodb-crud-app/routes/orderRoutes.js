// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const performanceController = require('../controllers/performanceController');
const userController = require('../controllers/userController'); // Add this line
const { authenticate, authorize } = require('../middleware/auth');

// User routes (no auth required)
router.post('/users/register', userController.register);
router.post('/users/login', userController.login);

// Read operations - any authenticated user
router.get('/orders', authenticate, orderController.getAllOrders);
router.get('/orders/:id', authenticate, orderController.getOrderById);
router.post('/search', authenticate, orderController.searchOrders);

// Write operations - admin only
router.post('/orders', authenticate, authorize('admin'), orderController.createOrder);
router.put('/orders/:id', authenticate, authorize('admin'), orderController.updateOrder);
router.delete('/orders/:id', authenticate, authorize('admin'), orderController.deleteOrder);

// Performance testing routes - admin only
router.post('/performance/test-without-index', authenticate, authorize(['admin']), performanceController.testWithoutIndex);
router.post('/performance/create-index', authenticate, authorize(['admin']), performanceController.createIndex);
router.post('/performance/test-with-index', authenticate, authorize(['admin']), performanceController.testWithIndex);


module.exports = router;