const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true, // Optional: Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Link', LinkSchema);
