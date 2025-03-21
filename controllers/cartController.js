const Cart = require('../models/cart');
const Product = require('../models/watch');


// Get cart by user ID
const getCartByUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId })
            .populate('user', 'username email')
            .populate('products.product');

        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Cart not found for this user'
            });
        }

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Add product to cart
const addProductToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        // Validate required fields
        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                error: 'Please provide product, quantity, and price'
            });
        }
        let product = await Product.findById(productId);
        const price = product.price;
        if (product.quantity < quantity) {
            return res.status(400).json({
                success: false,
                error: 'Not enough quantity available'
            });
        }
        // Find cart for user
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Create new cart if it doesn't exist
            cart = new Cart({
                user: userId,
                products: [{ product, quantity, price }],
                total_price: price * quantity
            });
        } else {
            // Check if product already exists in cart
            const existingProductIndex = cart.products.findIndex(
                item => item.product.toString() === productId
            );

            if (existingProductIndex > -1) {
                // Update quantity if product exists
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                // Add new product if it doesn't exist
                cart.products.push({ product, quantity, price });
            }

            // Recalculate total price
            cart.total_price = cart.products.reduce(
                (total, item) => total + (item.price * item.quantity),
                0
            );
        }

        await cart.save();

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Remove product from cart
const removeProductFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        // Find cart for user
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Cart not found for this user'
            });
        }

        // Filter out the product to remove
        const updatedProducts = cart.products.filter(
            item => item.product.toString() !== productId
        );

        // Update cart with new products array
        cart.products = updatedProducts;
        
        // Recalculate total price
        cart.total_price = cart.products.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );

        await cart.save();

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Remove one product from cart
const removeOne = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        // Find cart for user
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Cart not found for this user'
            });
        }

        // Find the product in the cart
        const productIndex = cart.products.findIndex(
            item => item.product.toString() === productId
        );
        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Product not found in cart'
            });
        }
        // Decrease the quantity of the product by 1
        cart.products[productIndex].quantity -= 1;
        // Recalculate total price
        cart.total_price = cart.products.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );

        if (cart.products[productIndex].quantity === 0) {
            // Remove the product from the cart if quantity is 0
            cart.products.splice(productIndex, 1);
        }

        await cart.save();
        res.status(200).json({
            success: true,
            data: cart
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}

// Clear cart
const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            { products: [], total_price: 0 },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Cart not found for this user'
            });
        }

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    getCartByUser,
    addProductToCart,
    removeProductFromCart,
    removeOne,
    clearCart
};
