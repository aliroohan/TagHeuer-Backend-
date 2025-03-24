const express = require('express');
const middleware = require('../middleware/auth');
const router = express.Router();
const {
    getAllWatches,
    getWatchById,
    createWatch,
    updateWatch,
    deleteWatch,
    searchWatches,
    getWatchesByCategory
} = require('../controllers/watchController');

// Watch routes
router.get('/', getAllWatches);
router.get('/search/:val', searchWatches);
router.get('/:id', getWatchById);
router.get('/category/:category', getWatchesByCategory)
router.post('/', middleware.isAdmin, createWatch);
router.put('/:id', middleware.isAdmin, updateWatch);
router.delete('/:id', middleware.isAdmin, deleteWatch);

module.exports = router;