const debug = require('debug')('app:passport');
const passport = require('passport');

require('./passport.local.strategy')();
require('./passport.jwt.strategy')();

module.exports = function passportConfig(app) {
  app.use(passport.initialize());

  // stores user in session
  passport.serializeUser((user, done) => {
    debug(user, 'serializing');
    done(null, user);
  });

  // retrieve user from session
  passport.deserializeUser((user, done) => {
    // finds user in database
    debug(user, 'deserializing');
    done(null, user);
  });
};
