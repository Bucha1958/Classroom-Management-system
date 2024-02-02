const passport = require('./auth');

const middleware = (req, res, next) => {
  // Passport's isAuthenticated checks if the user is logged in
  req.isAuthenticated() ? next() : res.status(401).send("Unauthorized");
};

module.exports = middleware;

