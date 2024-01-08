
const express = require('express');
const authController = require('../controllers/authController');
const registerController = require('../controllers/registerController');

const router = express.Router();

// Route for sending a login link
router.post('/send-login-link', authController.sendLoginLink);
router.post('/register', registerController.register);


module.exports = router;
