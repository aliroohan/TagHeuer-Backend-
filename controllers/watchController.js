const Watch = require('../models/watch');
const User = require('../models/user');

// Get all watches
const getAllWatches = async (req, res) => {
    try {
        const watches = await Watch.find();
        res.status(200).json(watches);
    } catch (error) {
        res.status(500).json({ 
            message: error.message 
        });
    }
};

//Get single watch by ID
const getWatchById = async (req, res) => {
    try {
        const watch = await Watch.findById(req.params.id);
        if (!watch) {
            return res.status(404).json({ 
                message: 'Watch not found' 
            });
        }
        res.status(200).json(watch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get watches by category
const getWatchesByCategory = async (req, res) => {
    try {
        const watches = await Watch.find({ category: {$regex: req.params.category, $options: 'i'} });
        if (!watches || watches.length === 0) {
            return res.status(404).json({ message: 'No watches found for the specified category' });
        }
        res.status(200).json(
            {
                watches: watches,
                message: 'Watches retrieved successfully'
            });
    } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    })
    }
};

//Create new watch
const createWatch = async (req, res) => {
    try {
        // Check if required fields are present according to schema
        const requiredFields = [
            'name',
            'reference',
            'price',
            'category',
            'description',
            'movement',
            'case',
            'strap',
            'dial',
            'quantity',
            'images'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Validate price and quantity are positive numbers
        if (req.body.price <= 0) {
            return res.status(400).json({
                message: 'Price must be a positive number'
            });
        }

        if (req.body.quantity <= 0) {
            return res.status(400).json({
                message: 'Quantity must be a positive number'
            });
        }

        // Check for existing watch with same reference number
        const existingWatch = await Watch.findOne({ reference: req.body.reference });
        if (existingWatch) {
            return res.status(400).json({
                message: 'A watch with this reference number already exists'
            });
        }

        const watch = await Watch.create(req.body);
        res.status(201).json(watch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update watch
const updateWatch = async (req, res) => {
    try {
        // Check if required fields are present
        const requiredFields = [
            'name',
            'reference',
            'price',
            'category',
            'description',
            'movement',
            'case',
            'strap',
            'dial',
            'quantity',
            'images'
        ];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Check for existing watch with same name (excluding current watch)
        const existingWatch = await Watch.findOne({
            name: req.body.name,
            _id: { $ne: req.params.id }
        });

        if (existingWatch) {
            return res.status(400).json({
                message: 'A watch with this name already exists'
            });
        }

        const watch = await Watch.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!watch) {
            return res.status(404).json({ 
                message: 'Watch not found' 
            });
        }
        
        res.status(200).json(watch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//Delete watch
const deleteWatch = async (req, res) => {
    try {
        const watch = await Watch.findById(req.params.id);
        
        if (!watch) {
            return res.status(404).json({
                success: false,
                message: 'Watch not found'
            });
        }

        await watch.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Watch removed'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// Search watches
const searchWatches = async (req, res) => {
    try {
        const keyword = req.params.val
            ? {
                $or: [
                    { name: { $regex: req.params.val, $options: 'i' } },
                    { reference: { $regex: req.params.val, $options: 'i' } },
                    { description: { $regex: req.params.val, $options: 'i' } }
                ]
            }
            : {};

        const watches = await Watch.find({ ...keyword });
        res.status(200).json(watches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export all functions as a single object
module.exports = {
    getAllWatches,
    getWatchById,
    getWatchesByCategory,
    createWatch,
    updateWatch,
    deleteWatch,
    searchWatches,
};