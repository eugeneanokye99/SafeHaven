const express = require('express');
const router = express.Router();
const {fetchSharedLocation} = require('../controllers/mapController');


router.get('/shared-locations', fetchSharedLocation); // New route for sharing location

module.exports = router;
