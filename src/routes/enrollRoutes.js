// classRoutes.js
const express = require('express');
const router = express.Router();
const enrollController = require('../controllers/enrollController');
const middleware = require('../../middleware');
const authMiddleware = require('../../authMiddleware');


// Routes require authentication

router.post('/classes/:classId/enroll', authMiddleware, enrollController.enrollStudent)
router.put('/classes/:classId/enroll', authMiddleware, enrollController.updateEnrollmentLink);

module.exports = router;