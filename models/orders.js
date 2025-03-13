const mongoose = require('mongoose');


const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Watch',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
        }
    ],
    total_price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'pending'
    }
},{ 
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);