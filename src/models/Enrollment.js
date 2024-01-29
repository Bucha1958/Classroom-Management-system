// enrollment.js (Enrollment Model)

const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    ref: 'User', // Reference to the User model for the student
    required: true,
  },
  classId: {
    type: String,
    ref: 'Class', // Reference to the Class model for the enrolled class
    required: true,
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  }
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
