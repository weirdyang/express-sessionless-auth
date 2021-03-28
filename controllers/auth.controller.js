const debug = require('debug')('app:auth:controller');
const { validationResult } = require('express-validator');
const passport = require('passport');

const { errorFormatter } = require('../formatters');
const HttpError = require('../models/http-error');
const User = require('../models/user');

const secureFlag = !!process.env.NODE_ENV;

const register = async (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data', 422),
    );
  }
  let newUser;
  try {
    newUser = new User(req.body);
    await newUser.save();
    return res.status(200).send({ message: `${newUser.username} please login` });
  } catch (error) {
    return next(
      new HttpError(error.message, 422),
    );
  }
};

const login = (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data', 422, errors.array()),
    );
  }
  debug(req.user);
  debug(req.session);
  debug(req.cookies);
  return passport.authenticate('local',
    (err, user, info) => {
      if (err) {
        debug(err);
        return next(err);
      }
      if (!user) {
        return res.status(403).send(info || 'invalid details');
      }
      const token = user.generateJWT();
      // if pass session: false, user will not be serialized
      // to use req.login() need to call passport.initialize()
      // https://stackoverflow.com/questions/25171231/passportjs-custom-callback-and-set-session-to-false
      return req.logIn(user, { session: false }, (error) => {
        if (error) {
          return next(
            new HttpError('Error logging in, please try again', 422),
          );
        }

        res.cookie('jwt',
          token,
          {
            httpOnly: true,
            secure: secureFlag, // set to false if using http
          });
        return res.status(200).send({ user: user.toJSON(), token });
      });
    })(req, res, next);
};

module.exports = {
  register,
  login,
};
