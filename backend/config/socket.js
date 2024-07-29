const Message = require('../models/Chat');
const User = require('../models/User'); // Assuming you have a User model to manage user information
const Notification = require('../models/Notification');

const users = {}; // To store connected users and their socket ids

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    // Store user's socket ID and update their status to online
    socket.on('register', async (userId) => {
      users[userId] = socket.id;
      console.log(`User ${userId} registered with socket ID ${socket.id}`);
      try {
        await User.findByIdAndUpdate(userId, { isOnline: true });
      } catch (err) {
        console.error('Error updating user status to online:', err);
      }
    });

    // Send existing messages to the client
    Message.find().then(messages => {
      socket.emit('init', messages);
    });

    // Listen for incoming messages
    socket.on('message', async (data) => {
      try {
        const newMessage = new Message(data);
        //await newMessage.save();

        io.emit('message', newMessage); // Broadcast message to all clients

        // Notify the recipient
        const recipientSocketId = users[data.to];
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('notification', newMessage);
        }

        // Fetch the sender's username
        const sender = await User.findById(data.from);
        const senderUsername = sender ? sender.name : 'Unknown';

        // Save notification to the database
        const newNotification = new Notification({
          userId: data.to,
          message: `New message from ${senderUsername}: ${data.text}`,
        });
       await newNotification.save();

      } catch (err) {
        console.error('Error saving message:', err);
      }
    });

    // Handle user disconnection
    socket.on('disconnect', async () => {
      console.log('A user disconnected');
      for (let userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          try {
            await User.findByIdAndUpdate(userId, { isOnline: false });
          } catch (err) {
            console.error('Error updating user status to offline:', err);
          }
          break;
        }
      }
    });
  });
};
