const express = require('express');
const { sendMessageToBot } = require('../controllers/chatController');
const router = express.Router();

router.post('/chatbot', sendMessageToBot);

module.exports = router;
