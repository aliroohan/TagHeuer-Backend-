const User = require('../models/user');
const Watch = require('../models/watch');
const jwt = require('jsonwebtoken');

// Create a new user
const createUser = async (req, res) => {
    try {
        // Check if required fields are present
        const { email, password, first_name, last_name } = req.body;
        if (!email || !password || !first_name || !last_name) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email, password, first name and last name'
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email:email }); // Query to find existing user by email
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'Email already registered' // Error message for existing email
            });
        }

        const newUser = new User(req.body); // Create a new user instance

        // Generate JWT token
        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);
        newUser.token = token; // Attach the token to the user object

        const savedUser = await newUser.save(); // Save the new user to the database
        res.status(201).json({
            success: true,
            data: newUser
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

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password'
            });
        }

        // Don't exclude the password field for authentication
        const user = await User.findOne({ email: email });
        console.log(user.is_admin);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        if (user.is_admin) {
            return res.status(401).json({
                success: false,
                error: 'Admin cannot login as a user'
            });
        }

        // Add 'const' to properly declare the variable
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return only necessary user information, not the entire user object
        return res.status(200).json({
            success: true,
            data: {
                id: user._id,
                email: user.email,
                token: token,
                // other non-sensitive fields
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password'
            });
        }

        // Check if the user is an admin
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        if (!user.is_admin) {
            return res.status(401).json({
                success: false,
                error: 'Only admins can login as admins'
            });
        }
        // Add 'const' to properly declare the variable
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            })
        }
        // Generate JWT token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Return only necessary user information, not the entire user object
        return res.status(200).json({
            success: true,
            data: {
                id: user._id,
                email: user.email,
                token: token,

            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })

    }
}
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

// add watch to wishlist
const addToWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            })
        }

        const watch = await Watch.findById(req.params.watchId);
        if (!watch) {
            return res.status(404).json({
                success: false,
                error: 'Watch not found'
            })
        }
        const wishlist = user.wishlist.map(id => id.toString().split('\'')[1])
        // Check if the watch is already in the wishlist
        console.log(wishlist[0])
        if (wishlist.includes(req.params.watchId)) {
            return res.status(400).json({
                success: false,
                error: 'Watch is already in the wishlist'
            })
        }
        // Add the watch to the wishlist

        user.wishlist.push(watch);
        await user.save();
        res.status(200).json({
            success: true,
            data: user
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            })
        }

        const wishlist = user.wishlist.map(id => id.toString().split('\'')[1])

        if (wishlist.includes(req.params.watchId)) {
            const query = await Watch.findById(req.params.watchId)
            user.wishlist.pull(query._id)
            await user.save();
            return res.status(200).json({
                success: true,
                data: user
            })
        }
        res.status(404).json({
            success: false,
            error: 'Watch not found in wishlist'
        })


    } catch (error){
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}
// Exporting all functions at the end
module.exports = {
    createUser,
    getAllUsers,
    loginUser,
    getUserById,
    updateUser,
    loginAdmin,
    deleteUser,
    addToWishlist,
    removeFromWishlist
};