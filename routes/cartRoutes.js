const express = require('express');
const router = express.Router();
const {
    createOrUpdateCart,
    getCartByUser,
    addProductToCart,
    removeProductFromCart,
    clearCart
} = require('../controllers/cartController');

// Cart routes
router.post('/', createOrUpdateCart);
router.get('/user/:userId', getCartByUser);
router.post('/user/:userId/product', addProductToCart);
router.delete('/user/:userId/product/:productId', removeProductFromCart);
router.delete('/user/:userId', clearCart);

module.exports = router;
