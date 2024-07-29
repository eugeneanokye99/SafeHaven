const express = require('express');
const router = express.Router();
const {fetchNotifications} = require('../controllers/notificationsController');


// Route to fetch notifications for a user
router.get('/fetch', fetchNotifications);

module.exports = router;
