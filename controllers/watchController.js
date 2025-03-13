const Watch = require('../models/watch');

// @desc    Get all watches
// @route   GET /api/watches
// @access  Public
exports.getAllWatches = async (req, res) => {
    try {
        const watches = await Watch.find();
        res.status(200).json(watches);
    } catch (error) {
        res.status(500).json({ 
            message: error.message 
        });
    }
};

// @desc    Get single watch by ID
// @route   GET /api/watches/:id
// @access  Public
exports.getWatchById = async (req, res) => {
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

// @desc    Create new watch
// @route   POST /api/watches
// @access  Private
exports.createWatch = async (req, res) => {
    try {
        // Check if required fields are present
        const requiredFields = ['name', 'brand', 'price'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Check for existing watch with same name
        const existingWatch = await Watch.findOne({ name: req.body.name });
        if (existingWatch) {
            return res.status(400).json({
                message: 'A watch with this name already exists'
            });
        }

        const watch = await Watch.create(req.body);
        res.status(201).json(watch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update watch
// @route   PUT /api/watches/:id
// @access  Private
exports.updateWatch = async (req, res) => {
    try {
        // Check if required fields are present
        const requiredFields = ['name', 'brand', 'price'];
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

// @desc    Delete watch
// @route   DELETE /api/watches/:id
// @access  Private
exports.deleteWatch = async (req, res) => {
    try {
        const watch = await Watch.findById(req.params.id);
        
        if (!watch) {
            return res.status(404).json({ message: 'Watch not found' });
        }

        await watch.deleteOne();
        res.status(200).json({ message: 'Watch removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search watches
// @route   GET /api/watches/search
// @access  Public
exports.searchWatches = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                $or: [
                    { name: { $regex: req.query.keyword, $options: 'i' } },
                    { reference: { $regex: req.query.keyword, $options: 'i' } },
                    { description: { $regex: req.query.keyword, $options: 'i' } }
                ]
            }
            : {};

        const watches = await Watch.find({ ...keyword });
        res.status(200).json(watches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
