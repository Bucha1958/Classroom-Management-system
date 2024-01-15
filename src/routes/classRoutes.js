// classRoutes.js
const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const middleware = require('../../middleware');
const authMiddleware = require('../../authMiddleware');


// Public routes (accessible to anyone)
router.get('/classes', classController.allClasses);
router.get('/classes/:classId', classController.getClass);

// Routes requiring authentication
router.post('/classes',  authMiddleware, classController.createClass);
router.put('/classes/:classId', authMiddleware, classController.updateClass);
router.delete('/classes/:classId', authMiddleware, classController.deleteClass);


module.exports = router;
