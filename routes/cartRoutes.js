const express = require('express');
const router = express.Router();
const {
    getCartByUser,
    addProductToCart,
    removeProductFromCart,
    removeOne,
    clearCart
} = require('../controllers/cartController');
const middleware = require("../middleware/auth");

// Cart routes
router.get('/user', middleware.auth, getCartByUser);
router.post('/user/product', middleware.auth, addProductToCart);
router.post('/user/product/remove', middleware.auth, removeOne);
router.delete('/user/product', middleware.auth, removeProductFromCart);
router.delete('/user', middleware.auth, clearCart);

module.exports = router;
