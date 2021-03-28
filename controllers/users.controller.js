const HttpError = require('../models/http-error');
const User = require('../models/user');

const wrap = (fn) => (...args) => fn(...args).catch(args[2]);
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
};
