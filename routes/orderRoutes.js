const express = require('express');
const middlewares = require('../middleware/auth');
const router = express.Router();
const {
    createOrder,
    getAllOrders,
    getOrdersByUser,
    getOrderById,
    updateOrderStatus
} = require('../controllers/orderController');

// Order routes
router.post('/', middlewares.auth, createOrder);
router.get('/', middlewares.isAdmin, getAllOrders);
router.get('/user', middlewares.auth, getOrdersByUser);
router.get('/:orderId', middlewares.auth, getOrderById);
router.put('/status', middlewares.isAdmin, updateOrderStatus);


module.exports = router;
