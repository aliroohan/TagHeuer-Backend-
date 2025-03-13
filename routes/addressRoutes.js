const express = require('express');
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
router.post('/', createAddress);
router.get('/', getAllAddresses);
router.get('/user/:userId', getAddressesByUser);
router.get('/:id', getAddressById);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

module.exports = router;
