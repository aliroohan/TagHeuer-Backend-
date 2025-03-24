const Address = require('../models/address');

// Create a new address
const createAddress = async (req, res) => {
    try {
        const { name, address, city, postal_code, country, phone, region, addressName } = req.body;
        const user = req.user._id;
        // Validate required fields
        if (!name || !address || !city || !postal_code || !country || !phone || !region) {
            return res.status(400).json({
                success: false,
                error: 'Please provide all required fields'
            });
        }

        const newAddress = new Address({user, name, address, city, postal_code, country, phone, region, addressName });
        const savedAddress = await newAddress.save();

        res.status(201).json({
            success: true,
            data: savedAddress
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get all addresses
const getAllAddresses = async (req, res) => {
    try {
        const addresses = await Address.find();

        res.status(200).json({
            success: true,
            count: addresses.length,
            data: addresses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get addresses by user ID
const getAddressesByUser = async (req, res) => {
    try {

        const userId = req.user._id;
        const addresses = await Address.find({ user: userId });

        res.status(200).json({
            success: true,
            count: addresses.length,
            data: addresses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get address by ID
const getAddressById = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({
                success: false,
                error: 'Address not found'
            });
        }

        res.status(200).json({
            success: true,
            data: address
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update address
const updateAddress = async (req, res) => {
    try {
        const address = await Address.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!address) {
            return res.status(404).json({
                success: false,
                error: 'Address not found'
            });
        }

        res.status(200).json({
            success: true,
            data: address
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete address
const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findByIdAndDelete(req.params.id);

        if (!address) {
            return res.status(404).json({
                success: false,
                error: 'Address not found'
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
    createAddress,
    getAllAddresses,
    getAddressesByUser,
    getAddressById,
    updateAddress,
    deleteAddress
};
