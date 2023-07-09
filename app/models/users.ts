const mongooseInUsers = require('mongoose');

const usersSchema = new mongooseInUsers.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  }
}, { versionKey: false })

module.exports = mongooseInUsers.model('Users', usersSchema);
