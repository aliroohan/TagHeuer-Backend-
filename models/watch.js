const mongoose = require('mongoose');

const WatchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    reference: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    movement: [
        {
            name: {
                type: String,
                required: true,
                trim: true
            },
            description: {
                type: String,
                required: true,
                trim: true
            }
        }
    ],
    case: [
        {
            name: {
                type: String,
                required: true,
                trim: true
            },
            description: {
                type: String,
                required: true,
                trim: true
            }
        }
    ],
    strap: [
        {
            name: {
                type: String,
                required: true,
                trim: true
            },
            description: {
                type: String,
                required: true,
                trim: true
            }
        }
    ],
    dial: [
        {
            name: {
                type: String,
                required: true,
                trim: true
            },
            description: {
                type: String,
                required: true,
                trim: true
            }
        }
    ],
    quantity: {
        type: Number,
        required: true,
        trim: true
    },
    images: [
        {
            type: String,
            required: true,
            trim: true
        }
    ],
    

}, {
    timestamps: true
}
);

module.exports = mongoose.model('Watch', WatchSchema);