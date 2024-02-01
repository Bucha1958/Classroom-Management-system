const mongoose = require('mongoose');

// Assignment Model
const assignmentSchema = new mongoose.Schema({
    title: String,
    description: String,
    deadline: Date,
    resources: [
        {
          type: String,
          url: String,
        },
    ],
    links: [
        {
          type: String,
          url: String,
        },
    ],
    submissions: [
        {
            studentId: { type: String, ref: 'User' },
            submissionText: String,
            grade: Number,
        },
    ],
    classId: { type: String, ref: 'Class'}
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;