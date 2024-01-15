// authController.js
const passport = require('passport');


exports.login = passport.authenticate('google', { scope: ['email', 'profile'] });

exports.callback = passport.authenticate('google', {
    successRedirect: '/auth/success',
    failureRedirect: '/auth/google/failure'
});

exports.failure = (req, res) => {
    res.send("Something went wrong");
};

exports.success = (req, res) => {
    let name = req.user.displayName;
    res.send(`Welcome ${name}`);
};
