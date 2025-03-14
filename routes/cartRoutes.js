const express = require('express');
const router = express.Router();
const {
    getCartByUser,
    addProductToCart,
    removeProductFromCart,
    removeOne,
    clearCart
} = require('../controllers/cartController');
const auth = require("../middleware/auth");

// Cart routes
router.get('/user', auth.auth, getCartByUser);
router.post('/user/product', auth.auth,addProductToCart);
router.post('/user/product/remove', auth.auth, removeOne);
router.delete('/user/product', auth.auth, removeProductFromCart);
router.delete('/user', auth.auth, clearCart);

module.exports = router;
