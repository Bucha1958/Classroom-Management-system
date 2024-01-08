// controllers/authController.js

const User = require('../models/User');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
require('dotenv').config();

const emailConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_HANDLE,
    pass: process.env.EMAIL_PASS,
  },
  
};




const sendLoginLink = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email is associated with an existing user
    let user = await User.findOne({ email });

    // If the user doesn't exist, create a new user
    if (!user) {
      user = new User({ email });
      await user.save();
    }

    // Generate a unique token
    const authToken = randomstring.generate(32);

    // Save the token to the user's record
    user.authToken = authToken;
    await user.save();

    const baseURL = `${req.protocol}://${req.get('host')}`;


    // Send an email with the login link
    const transporter = nodemailer.createTransport(emailConfig);

    const mailOptions = {
      from: emailConfig.auth.user,
      to:  "staneziechina@gmail.com",
      subject: 'Login to Your App',
      text: `Click the following link to log in: ${baseURL}/login/${authToken}`,
    };

    await transporter.sendMail(mailOptions);


    res.status(200).json({ message: 'Login link sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  sendLoginLink,
};


