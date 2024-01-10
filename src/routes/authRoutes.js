// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const middleware = require('../../middleware');

router.get('/google', authController.login);
router.get('/google/callback', authController.callback);
router.get('/google/failure', authController.failure);
router.get('/success', middleware, authController.success);

module.exports = router;
