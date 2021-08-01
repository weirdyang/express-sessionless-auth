const debug = require('debug')('app:auth:controller');
const { validationResult } = require('express-validator');
const passport = require('passport');

const { errorFormatter, handleError } = require('../formatters');
const HttpError = require('../models/http-error');
const User = require('../models/user');

const secureFlag = process.env.NODE_ENV === 'production';

const register = async (req, res, next) => {
  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    debug(result.array());
    return next(
      new HttpError('Invalid inputs passed, please check your data', 422, result.array()),
    );
  }
  let newUser;
  try {
    newUser = new User(req.body);
    await newUser.save();
    return res.status(200).send({ message: `${newUser.username} please login` });
  } catch (error) {
    return handleError(error, next);
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
          secure: secureFlag, // set to false if using http
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
