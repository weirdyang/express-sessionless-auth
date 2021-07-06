const debug = require('debug')('app:auth:controller');
const { validationResult } = require('express-validator');
const passport = require('passport');

const { errorFormatter } = require('../formatters');
const HttpError = require('../models/http-error');
const User = require('../models/user');

const secureFlag = process.env.NODE_ENV === 'production';

const formatErrors = (error) => Object.keys(error.errors).reduce((errors, key) => {
  const message = errors;
  message[key] = error.errors[key].message;

  return message;
}, {});
const register = async (req, res, next) => {
  debug(req);
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    debug(errors.array());
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
    if (error.name === 'ValidationError') {
      return res.status(422).json({
        errors: formatErrors(error),
      });
    }
    return next(
      new HttpError(error.message, 500),
    );
  }
};
const logOut = (req, res) => {
  debug(req.cookies);
  res.clearCookie('jwt');
  return res.json('logged out');
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
  return passport.authenticate('local', { session: false },
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

      res.cookie('jwt',
        token,
        {
          httpOnly: true,
          secure: true, // set to false if using http
          sameSite: 'none',
        });
      return res.status(200).send({ user: user.toJSON() });
    })(req, res, next);
};

const getCrsfToken = (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.json({ token: req.csrfToken() });
};
module.exports = {
  register,
  login,
  logOut,
  getCrsfToken,
};
