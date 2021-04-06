const debug = require('debug')('app:passport-strategy');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

module.exports = function localStrategy() {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        User.findOne({ email }, '_id username email password')
          .then(async (user) => {
            debug(user);
            if (!user) {
              return done(null, false, { message: 'unable to find account with this username' });
            }
            return user.validatePassword(password, (err, result) => {
              if (err) {
                debug(err);
                return done(err, false, { message: err.message });
              }
              if (!result) {
                return done(null, false, { message: 'incorrect password' });
              }
              return done(null, user);
            });
          })
          .catch((err) => done(err, false, { message: err.message }));
      },
    ),
  );
};
