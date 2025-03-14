const express = require('express');
const middlewares = require('../middleware/auth');
const router = express.Router();
const {
    createOrder,
    getAllOrders,
    getOrdersByUser,
    getOrderById,
    updateOrderStatus,
    deleteOrder
} = require('../controllers/orderController');

// Order routes
router.post('/', middlewares.auth, createOrder);
router.get('/', middlewares.isAdmin, getAllOrders);
router.get('/user/', middlewares.auth, getOrdersByUser);
router.get('/adminorderId', middlewares.auth, getOrderById);
router.put('/orderId/status', middlewares.isAdmin,updateOrderStatus);
router.delete('/', deleteOrder);

module.exports = router;
