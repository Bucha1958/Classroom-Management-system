const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const authMiddleware = require('../../authMiddleware');



// Create assignment
router.post('classes/:classId/assignments', authMiddleware, assignmentController.createAssignment);

// Get the arrays of assignments
router.get('classes/:classId/assignments', authMiddleware, assignmentController.listAssignments);

// Get a single assignment
router.get('classes/:classId/assignments/:assignmentId', authMiddleware, assignmentController.listAssignment);

// Update the assignment
router.put('classes/:classId/assignments/:assignmentId', authMiddleware, assignmentController.updatedAssignment)

// Delete the assignment
router.delete('classes/:classId/assignments/:assignmentId', authMiddleware, assignmentController.deleteAssignment);

// Submit assignment
router.post('classes/:classId/assignments/:assignmentId', authMiddleware, assignmentController.submitAssignment);

// Grade assignment
router.put('classes/:classId/assignments/:assignmentId/:studentId', authMiddleware, assignmentController.gradeAssignment);

module.exports = router;