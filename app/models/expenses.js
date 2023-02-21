const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  value: {
    required: true,
    type: Number
  },
  date: {
    required: true,
    type: Date
  },
  description: {
    required: true,
    type: String
  }
}, { versionKey: false })

module.exports = mongoose.model('Expenses', schema)