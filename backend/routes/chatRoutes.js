const express = require('express');
const { sendMessageToBot, getMessages, sendMessage, getChats, getBotMessages  } = require('../controllers/chatController');
const router = express.Router();

router.post('/chatbot', sendMessageToBot);
router.get('/messages', getMessages);
router.get('/botmessages', getBotMessages);
router.post('/send', sendMessage);
router.get('/list', getChats);

module.exports = router;
