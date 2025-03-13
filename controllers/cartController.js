const Cart = require('../models/cart');

// Create or update cart
const createOrUpdateCart = async (req, res) => {
    try {
        const { user, products, total_price } = req.body;

        // Validate required fields
        if (!user || !products || !total_price) {
            return res.status(400).json({
                success: false,
                error: 'Please provide user, products, and total price'
            });
        }

        // Find if cart exists for user
        let cart = await Cart.findOne({ user });

        if (cart) {
            // Update existing cart
            cart = await Cart.findOneAndUpdate(
                { user },
                { products, total_price },
                {
                    new: true,
                    runValidators: true
                }
            );
        } else {
            // Create new cart
            cart = new Cart({
                user,
                products,
                total_price
            });
            await cart.save();
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

// Get cart by user ID
const getCartByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
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
        const { userId } = req.params;
        const { product, quantity, price } = req.body;

        // Validate required fields
        if (!product || !quantity || !price) {
            return res.status(400).json({
                success: false,
                error: 'Please provide product, quantity, and price'
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
                item => item.product.toString() === product
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
        const { userId, productId } = req.params;

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

// Clear cart
const clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

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
    createOrUpdateCart,
    getCartByUser,
    addProductToCart,
    removeProductFromCart,
    clearCart
};
