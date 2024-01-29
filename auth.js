const passport = require('passport');
const User = require('./src/models/User');
require('dotenv').config();


const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    request.session.accessToken = accessToken;
    console.log(request.session);
    // Find the user by googleId
    User.findOne({ googleId: profile.id })
      .then(user => {
        // If the user already exists, return it
        if (user) {
          return done(null, user);
        }
  
        // If the user does not exist, create a new user
        const newUser = new User({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.email,
        });
  
        // Save the new user to the database
        newUser.save()
          .then(savedUser => {
            // Return the newly created user
            return done(null, savedUser);
          })
          .catch(saveError => {
            // Handle the error if saving the new user fails
            return done(saveError, null);
          });
      })
      .catch(findError => {
        // Handle the error if finding the user fails
        return done(findError, null);
      });
  }
  
)); 

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .exec()
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            done(err, null);
        });
});

module.exports = passport;