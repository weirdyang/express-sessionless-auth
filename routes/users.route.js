const express = require('express');

const { getUsers, getUser } = require('../controllers/users.controller');

const { auth } = require('./auth.routes');

const router = express.Router();
// get all users
router.get('/', auth.jwt, getUsers);
// get single user
router.get('/:userId', auth.jwt, getUser);

module.exports = router;
