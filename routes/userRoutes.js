const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginAdmin,
    loginUser,
    addToWishlist,
    removeFromWishlist
} = require('../controllers/userController');

// User routes
router.post('/', createUser);
router.post('/login', loginUser);
router.post('/adminLogin', loginAdmin);
router.get('/', auth.isAdmin, getAllUsers);
router.get('/:id', auth.isAdmin, getUserById);
router.put('/:id', auth.auth, updateUser);
router.delete('/:id', auth.isAdmin, deleteUser);
router.post('/wishlist/:watchId', auth.auth, addToWishlist);
router.delete('/wishlist/:watchId', auth.auth, removeFromWishlist);

module.exports = router;
