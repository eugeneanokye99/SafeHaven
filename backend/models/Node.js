const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  question: { type: String, required: true },
  options: [
    {
      id: { type: String, required: true },
      text: { type: String, required: true },
      next_node: { type: String },
      response: { type: String }
    }
  ]
});

module.exports = mongoose.model('Node', NodeSchema);