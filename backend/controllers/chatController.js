const Chat = require('../models/Chat');

// Send message to chat bot
exports.sendMessageToBot = async (req, res) => {
    const userMessage = req.body.message;
    
    try {
      // Save user message to the database
      const userChat = new Chat({ message: userMessage, sender: 'user' });
      await userChat.save();
  
      const response = await getResponse(userMessage);
      
      // Save bot response to the database
      const botChat = new Chat({ message: response, sender: 'bot' });
      await botChat.save();
  
      res.json({ reply: response });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  async function getResponse(message) {
    // Dummy implementation, replace with your logic
    if (message.toLowerCase().includes('hello')) {
      return 'Hi there!';
    } else {
      return 'I don\'t understand. Please elaborate.';
    }
  }