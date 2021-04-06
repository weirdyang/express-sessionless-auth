/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const debug = require('debug')('app:user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { secret } = require('../config');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true, // always convert username to lowercase
    required: [true, 'this can not be blank'],
    unique: true,
    minLength: 6,
    trim: true,
    index: true,
    match: [/^[a-zA-Z0-9]+$/, 'no special characters'],
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
  journals: {
    type: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Journal' }],
  },
}, { timestamps: true });

userSchema.plugin(uniqueValidator, { message: '{PATH} is in use' });

userSchema.methods.generateJWT = function generateToken() {
  const exp = new Date();
  exp.setDate(exp.getDate() + 60);
  debug(exp);
  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000, 10),
  }, secret);
};

userSchema.methods.toJSON = function toJson() {
  return {
    id: this._id,
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

module.exports = mongoose.model('User', userSchema);
