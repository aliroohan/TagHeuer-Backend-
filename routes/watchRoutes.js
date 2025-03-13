const express = require('express');
const router = express.Router();
const {
    getAllWatches,
    getWatchById,
    createWatch,
    updateWatch,
    deleteWatch,
    searchWatches
} = require('../controllers/watchController');

// Watch routes
router.get('/', getAllWatches);
router.get('/search', searchWatches);
router.get('/:id', getWatchById);
router.post('/', createWatch);
router.put('/:id', updateWatch);
router.delete('/:id', deleteWatch);

module.exports = router; 