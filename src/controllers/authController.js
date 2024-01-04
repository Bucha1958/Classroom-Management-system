// controllers/authController.js

const User = require('../models/User');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

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

    // Send an email with the login link
    const transporter = nodemailer.createTransport(emailConfig);

    const mailOptions = {
      from: emailConfig.auth.user,
      to: email,
      subject: 'Login to Your App',
      text: `Click the following link to log in: http://your-app.com/login/${authToken}`,
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
