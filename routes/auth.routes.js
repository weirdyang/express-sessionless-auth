const express = require('express');
const { check } = require('express-validator');
const passport = require('passport');

const { register, login } = require('../controllers/auth.controller');

const router = express.Router();
router.post('/register',
  [
    check('username').not().isEmpty().bail(),
    check('email').normalizeEmail().isEmail().bail(),
    check('password').not().isEmpty().bail(),
  ], register);
router.post('/login',
  [
    check('username').not().isEmpty().bail(),
    check('password').not().isEmpty().bail(),
  ], login);
module.exports = {
  auth: {
    jwt: (req, res, next) => passport.authenticate('jwt', { session: false })(req, res, next),
    local: passport.authenticate('local', { session: false }),
  },
  router,
};
