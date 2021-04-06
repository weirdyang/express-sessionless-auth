const express = require('express');

const { getUsers, getUser, getUserInfo } = require('../controllers/users.controller');

const { auth } = require('./auth.routes');

const router = express.Router();
router.use(auth.jwt);
// get all users
router.get('/', getUsers);
// get self
router.get('/self', getUserInfo);
// get single user
router.get('/single/:userId', getUser);
module.exports = router;
