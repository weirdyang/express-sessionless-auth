const HttpError = require('../models/http-error');
const User = require('../models/user');

const wrap = (fn) => (...args) => fn(...args).catch(args[2]);

const getUserProfile = wrap(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.sendStatus(401);
  }
  // eslint-disable-next-line no-underscore-dangle
  const profile = req.profile.toProfileJSONFor(user || false);
  return res.json({ profile });
});
const followUser = wrap(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.sendStatus(401);
  }
  // eslint-disable-next-line no-underscore-dangle
  await user.followUser(req.profile._id);
  return res.json(user.toObject({ getters: true }));
});
const unfollowUser = wrap(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.sendStatus(401);
  }
  // eslint-disable-next-line no-underscore-dangle
  await user.unfollowUser(req.profile._id);
  return res.json(user.toObject({ getters: true }));
});
const getUsers = wrap(async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later',
      500,
    );
    return next(error);
  }

  return res.json({ users: users.map((user) => user.toObject({ getters: true })) });
});

const getUserInfo = wrap(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.sendStatus(401);
  }
  return res.json({ user: user.toJSON() });
});
const getUser = wrap(async (req, res, next) => {
  // userId is passed in the req.pararms
  // e.g /users/<userId>
  // .route(/:userId)
  const { userId } = req.params;
  let user;
  try {
    user = await User.findById(userId, '-password');
  } catch (err) {
    const error = new HttpError(
      'Eror fetching user details, please try again later',
      500,
    );
    return next(error);
  }
  if (!user) {
    return next(new HttpError(
      'User not found', 404,
    ));
  }
  return res.json(user.toObject({ getters: true }));
});
module.exports = {
  getUsers,
  getUser,
  getUserInfo,
  followUser,
  unfollowUser,
  getUserProfile,
};
