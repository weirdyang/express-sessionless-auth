const debug = require('debug')('app:passport-jwt');
const passport = require('passport');
const passportJWT = require('passport-jwt');

const { secret } = require('./index');

const JWTStrategy = passportJWT.Strategy;

module.exports = function jwtstrategy() {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: (req) => req.cookies.jwt,
        secretOrKey: secret,
      },
      (jwtPayload, done) => {
        console.log(jwtPayload);
        if (!jwtPayload.id || !jwtPayload.username) {
          console.log(jwtPayload, 'jwtpayload');
          debug('no jwtpayload');
          return done(null, false, { message: 'invalid payload' });
        }
        // this handled by passport
        // if (Date.now() > jwtPayload.expires) {
        //   console.log('expired jwt');
        //   debug('expired jwt');
        //   return done(null, false, { message: 'jwt expired' });
        // }

        return done(null, jwtPayload);
      },
    ),
  );
};
