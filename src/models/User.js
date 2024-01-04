// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Your existing fields
  email: { type: String, required: true, unique: true },

  // Passwordless authentication token
  authToken: { type: String, default: null },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
