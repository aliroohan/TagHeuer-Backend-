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
    loginUser
} = require('../controllers/userController');

// User routes
router.post('/', createUser);
router.post('/login', loginUser);
router.post('/adminLogin', loginAdmin);
router.get('/', auth.isAdmin, getAllUsers);
router.get('/:id', auth.isAdmin, getUserById);
router.put('/:id', auth.auth, updateUser);
router.delete('/:id', auth.isAdmin, deleteUser);

module.exports = router;
