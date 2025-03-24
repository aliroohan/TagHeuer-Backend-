const express = require('express');
const middleware = require('../middleware/auth');
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
    removeFromWishlist,
    changeEmail,
    updatePassword
} = require('../controllers/userController');

// User routes
router.post('/', createUser);
router.post('/login', loginUser);
router.post('/adminLogin', loginAdmin);
router.get('/', middleware.isAdmin, getAllUsers);
router.get('/:id', middleware.isAdmin, getUserById);
router.put('/', middleware.auth, updateUser);
router.delete('/:id', middleware.isAdmin, deleteUser);
router.post('/wishlist/:watchId', middleware.auth, addToWishlist);
router.delete('/wishlist/:watchId', middleware.auth, removeFromWishlist);
router.put('/password', middleware.auth, updatePassword);
router.put('/email', middleware.auth, changeEmail);

module.exports = router;
