
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Route for sending a login link
router.post('/send-login-link', authController.sendLoginLink);

module.exports = router;
