const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new LocalStrategy({
  usernameField: 'email' // Field for the email address
}, async function(email, password, done) {
  try {
    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      return done(null, false, { message: 'Incorrect email.' });
    }
    if (user.password !== password) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (err) {
    done(err);
  }
});

//check if user is authenticated
passport.checkAuthentication = function(req, res, next){
    if (req.isAuthenticated()) {
        return next();
      }
     return res.redirect('/user/sign-in');
    }

passport.setAuthenticatedUser = function(req, res, next){
    if (req.isAuthenticated()) {
         res.locals.user = req.user;
         }
         next();
        }


module.exports = passport;
