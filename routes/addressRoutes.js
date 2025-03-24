const express = require('express');
const middleware = require('../middleware/auth');
const router = express.Router();
const {
    createAddress,
    getAllAddresses,
    getAddressesByUser,
    getAddressById,
    updateAddress,
    deleteAddress
} = require('../controllers/addressController');


// Address routes
router.post('/', middleware.auth, createAddress);
router.get('/', middleware.isAdmin, getAllAddresses);
router.get('/user', middleware.auth, getAddressesByUser);
router.get('/:id', middleware.auth, getAddressById);
router.put('/:id', middleware.auth, updateAddress);
router.delete('/:id', middleware.auth, deleteAddress);

module.exports = router;
