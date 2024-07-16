
const mongoose = require('mongoose');
const chatSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
