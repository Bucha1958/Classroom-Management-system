// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Your existing fields
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  }
},
{
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
