const User = require('../models/user');

// Create a new user
const createUser = async (req, res) => {
    try {
        // Check if required fields are present
        const { email, password, username } = req.body; // Destructure required fields from request body
        if (!email || !password || !username) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email, password and username' // Error message for missing fields
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email }); // Query to find existing user by email
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'Email already registered' // Error message for existing email
            });
        }

        const newUser = new User(req.body); // Create a new user instance
        const savedUser = await newUser.save(); // Save the new user to the database
        res.status(201).json({
            success: true,
            data: savedUser // Return the saved user data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message // Return error message in case of failure
        });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.status(200).json({
            success: true,
            count: users.length, // Count of users returned
            data: users // Return the list of users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message // Return error message in case of failure
        });
    }
};

// Get single user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // Find user by ID from request parameters
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found' // Error message if user is not found
            });
        }
        res.status(200).json({
            success: true,
            data: user // Return the found user data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message // Return error message in case of failure
        });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true, // Return the updated user
                runValidators: true // Validate the update against the model's schema
            }
        );
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found' // Error message if user is not found
            });
        }
        res.status(200).json({
            success: true,
            data: user // Return the updated user data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message // Return error message in case of failure
        });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id); // Delete user by ID from request parameters
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found' // Error message if user is not found
            });
        }
        res.status(200).json({
            success: true,
            data: {} // Return empty object on successful deletion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message // Return error message in case of failure
        });
    }
};

// Exporting all functions at the end
module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};