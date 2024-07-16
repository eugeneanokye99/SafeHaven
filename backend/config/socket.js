const Message = require('../models/Chat'); 

const users = {}; // To store connected users and their socket ids

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    // Store user's socket ID
    socket.on('register', (userId) => {
      users[userId] = socket.id;
      console.log(`User ${userId} registered with socket ID ${socket.id}`);
    });

    // Send existing messages to the client
    Message.find().then(messages => {
      socket.emit('init', messages);
    });

    // Listen for incoming messages
    socket.on('message', async (data) => {
      try {
        const newMessage = new Chat(data);
        // await newMessage.save();

        io.emit('message', newMessage); // Broadcast message to all clients

        // Notify the recipient
        const recipientSocketId = users[data.to];
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('notification', newMessage);
        }
      } catch (err) {
        console.error('Error saving message:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
      // Remove the user from the users object
      for (let userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          break;
        }
      }
    });
  });
};
