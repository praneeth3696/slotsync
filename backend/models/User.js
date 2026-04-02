const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['admin', 'cr'],
    required: true
  },
  programme: {
    type: String
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
