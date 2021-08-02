/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const debug = require('debug')('app:user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { secret } = require('../config');

const roles = {
  normal: 'user',
  superuser: 'admin',
};
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true, // always convert username to lowercase
    required: [true, 'this can not be blank'],
    unique: true,
    minLength: [6, 'Usernames needs to be at least 6 characters'],
    trim: true,
    index: true,
    match: [/^[a-zA-Z0-9]+$/, 'no special characters'],
  },
  avatar: {
    type: String,
    lowercase: true,
    required: [true, 'please select an avatar'],
  },
  email: {
    type: String,
    index: true,
    unique: true,
    required: [true, 'this can not be blank'],
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'invalid email'],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: roles.normal,
  },
  products: {
    type: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Product' }],
  },
  journals: {
    type: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Journal' }],
  },
  following: {
    type: [{ type: mongoose.Types.ObjectId, required: false, ref: 'User' }],
  },
}, { timestamps: true });

userSchema.plugin(uniqueValidator, { message: '{PATH} is in use' });
userSchema.methods.toProfileJSONFor = function toUserProfile(user) {
  return {
    username: this.username,
    avatar: this.avatar,
    following: user ? user.isFollowing(this._id) : false,
  };
};
userSchema.methods.unfollow = function unfollowUser(userId) {
  this.following.pull(userId);
  return this.save();
};
userSchema.methods.follow = function followUser(userId) {
  if (this.favorites.indexOf(userId) === -1) {
    this.favorites.push(userId);
  }

  return this.save();
};
userSchema.methods.isFollowing = function isFollowing(id) {
  return this.following.some((followId) => followId.toString() === id.toString());
};
userSchema.methods.generateJWT = function generateToken() {
  const exp = new Date();
  exp.setDate(exp.getDate() + 60);
  debug(exp);
  return jwt.sign({
    id: this._id,
    username: this.username,
    role: this.role,
    exp: parseInt(exp.getTime() / 1000, 10),
  }, secret);
};

userSchema.methods.toJSON = function toJson() {
  return {
    id: this._id,
    avatar: this.avatar,
    email: this.email,
    username: this.username,
  };
};

userSchema.methods.validatePassword = function validate(password, callback) {
  debug('validate', password, callback);
  return bcrypt.compare(
    password,
    this.password,
    (err, same) => {
      callback(err, same);
    },
  );
};

userSchema.methods.roles = function getRoles() {
  return roles;
};
// middleware, intercept before save
userSchema.pre('save', function hashMiddleWare(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  debug(user);
  return bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      debug(err);
      return next(err);
    }

    user.password = hash;
    return next();
  });
});
const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  roles,
};
