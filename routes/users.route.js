const express = require('express');

const {
  getUsers, getUser, getUserInfo, followUser, unfollowUser, getUserProfile,
} = require('../controllers/users.controller');
const User = require('../models/user');

const { auth } = require('./auth.routes');

const router = express.Router();
router.use(auth.jwt);

router.param('username', (req, res, next, username) => {
  User.findOne({ username }).then((user) => {
    if (!user) { return res.sendStatus(404); }

    req.profile = user;

    return next();
  }).catch(next);
});
// get all users
router.get('/', getUsers);
// get self
router.get('/self', getUserInfo);
// get single user
router.get('/single/:userId', getUser);
// get profile of user for viewing
router.get('/profile/:username', getUserProfile);
// post to follow user by username
router.post('/follow/:username', followUser);
// post to unfollow user by username
router.post('/unfollow/:username', unfollowUser);
module.exports = router;
