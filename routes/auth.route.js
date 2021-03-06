const express = require('express');
const { check } = require('express-validator');
const passport = require('passport');

const {
  register, login, logOut, getCrsfToken,
} = require('../controllers/auth.controller');

const router = express.Router();
router.post('/register',
  [
    check('username').not().isEmpty().withMessage('Username can not be empty')
      .bail(),
    check('email').normalizeEmail().isEmail().withMessage('Invalid email')
      .bail(),
    check('password').not().isEmpty().withMessage('Invalid password')
      .bail(),
  ], register);

router.post('/login',
  [
    check('username').not().isEmpty().bail(),
    check('password').not().isEmpty().bail(),
  ], login);

router.get('/logout', logOut);

router.get('/crsftoken', getCrsfToken);

module.exports = {
  auth: {
    jwt: (req, res, next) => passport.authenticate('jwt', { session: false })(req, res, next),
    local: passport.authenticate('local', { session: false }),
  },
  router,
};
