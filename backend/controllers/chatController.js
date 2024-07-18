const Chat = require('../models/Chat');
const ChatBot = require('../models/ChatBot');
const User = require('../models/User'); 
const mongoose = require('mongoose');
const axios = require('axios');
const djangoBackendUrl = 'http://127.0.0.1:8000/chatbot/predict/';

const predictResponse = async (message) => {
  try {
    const response = await axios.post(djangoBackendUrl, { message });
    return response.data.response;
  } catch (error) {
    console.error('Error getting response from Django backend:', error.message);
    throw new Error('Failed to get response from chatbot');
  }
};

// Send message to chat bot
exports.sendMessageToBot = async (req, res) => {
  const userMessage = req.body.message;
  const userId = req.body.userId;

    // Convert userId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);
  
  try {
    // Save user message to the database
    const userChat = new ChatBot({ message: userMessage, sender: userObjectId });
    await userChat.save();

    const response = await predictResponse(userMessage);
    
    // Save bot response to the database
    const botChat = new ChatBot({ message: response, sender: 'bot' });
    await botChat.save();

    res.json({ reply: response });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};








// Function to fetch messages between a user and the bot
exports.getBotMessages = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }


    // Find messages where the sender is either the user or the bot
    const messages = await ChatBot.find({
      $or: [
        { sender: userId },
        { sender: 'bot' }
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({ message: error.message });
  }
};


exports.getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.query;

    if (!user1 || !user2) {
      return res.status(400).json({ message: 'User IDs are required' });
    }

    const messages = await Chat.find({
      $or: [
        { from: user1, to: user2 },
        { from: user2, to: user1 }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { from, to, text } = req.body;

    const newMessage = new Chat({ from, to, text });
    await newMessage.save();

    res.json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error.message);
    res.status(500).json({ message: error.message });
  }
};





exports.getChats = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID' });
    }

    // Convert userId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Aggregation pipeline to find the latest message between two users
    const chats = await Chat.aggregate([
      {
        $match: {
          $or: [
            { to: userObjectId },
            { from: userObjectId }
          ]
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$from', userObjectId] },
              '$to',
              '$from'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      },
    ]);

   // Fetch user details for each chat
   const chatDetails = await Promise.all(
    chats.map(async chat => {
      const otherUserId = chat.lastMessage.from.toString() === userId ? chat.lastMessage.to : chat.lastMessage.from;
      const otherUser = await User.findById(otherUserId).select('name profileImage');

      const time = chat.lastMessage.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
      
      return {
        _id: otherUser._id,
        name: otherUser.name,
        profileImage: otherUser.profileImage,
        lastMessage: chat.lastMessage.text,
        time: time
      };
    })
  );

  res.json(chatDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// exports.saveMessage = async (data) => {
//   const newMessage = new Chat(data);
//   await newMessage.save();
//   return newMessage;
// };

// exports.getMessages = async () => {
//   return await Chat.find();
// };