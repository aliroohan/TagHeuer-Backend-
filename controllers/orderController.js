const Order = require('../models/orders');
const Cart = require('../models/cart');
const Watch = require('../models/watch');

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { products, total_price } = req.body;
        const user = req.user;

        // Validate required fields
        if (!user || !products || !total_price) {
            return res.status(400).json({
                success: false,
                error: 'Please provide user, products, quantity and total price'
            });
        }

        // Create new order
        const newOrder = new Order({
            user,
            products,
            total_price,
            status: 'pending' // Default status
        });



        const savedOrder = await newOrder.save();

        // Get current cart
        const userCart = await Cart.findOne({ user: user });
        if (userCart) {
            // Filter out products that are in the order
            const orderProductIds = products.map(p => p.product.toString());
            const remainingProducts = userCart.products.filter(p => !orderProductIds.includes(p.product.toString()));

            // Recalculate total price for remaining products
            const newTotalPrice = remainingProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Update cart with remaining products
            await Cart.findOneAndUpdate(
                { user: user },
                {
                    products: remainingProducts,
                    total_price: newTotalPrice
                }
            );
        }

        // Update watch quantities
        for (const product of products) {
            const watch = await Watch.findById(product.product);
            if (watch) {
                watch.quantity -= product.quantity;
                await watch.save();
            }
        }

        res.status(201).json({
            success: true,
            data: savedOrder
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'username email')
            .populate('products.product');

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get orders by user ID
const getOrdersByUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ user: userId })
            .populate('user', 'username email')
            .populate('products.product');

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.body._id)
            .populate('user', 'username email')
            .populate('products.product');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { status, orderId } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                error: 'Please provide status'
            });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete order
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.user._id);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrdersByUser,
    getOrderById,
    updateOrderStatus,
    deleteOrder
};
