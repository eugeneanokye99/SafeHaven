const express = require('express');
const router = express.Router();
const mapController = require('../controllers/mapController');

// POST route to save or update user location
router.post('/location', mapController.saveOrUpdateLocation);

// GET route to fetch nearby user locations
router.get('/locations', mapController.fetchNearbyLocations);

module.exports = router;
