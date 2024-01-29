const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const classSchema = new mongoose.Schema({
  // Basic details
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // Admin and members
  admin: {
    type: String,
    required: true,
  },
  members: [
    {
    type: String,
    },
  ],
  inviteCode: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  // Schedule and timings
  schedule: {
    days: [
      {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
    ],
    startTime: {
      type: String, // You might want to use a proper time format
    },
    endTime: {
      type: String, // You might want to use a proper time format
    },
  },

  // Assignments
  assignments: [
    {
      title: {
        type: String,
        required: true,
      },
      description: String,
      dueDate: Date,
    },
  ],

  // Resources
  resources: [
    {
      title: {
        type: String,
        required: true,
      },
      description: String,
      link: String,
    },
  ],

  // Discussion forum
  discussions: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      message: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  // Timestamps for when the class was created and last updated
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
