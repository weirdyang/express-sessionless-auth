/* eslint-disable no-underscore-dangle */
// Import the dependencies for testing
const { assert } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// const productId = config.productId;
const app = require('../../app');
const { PORT } = require('../../config');
const { secret } = require('../../config');
const { User } = require('../../models/user');
// Configure chai
chai.use(chaiHttp);
chai.should();

const user = new User({
  username: 'abcdefg',
  password: 'abcdefg',
  avatar: 'leaf',
  email: 'axzc2swdf@email.com',
});

describe('passport jwt strategy', () => {
  let server;
  before(async () => {
    // console.log(user._id);
    server = app.listen(PORT,
      () => console.log(`Your server is running on port ${PORT}`));
    await user.save();
    user.token = user.generateJWT();
  });
  after(async () => {
    // console.log('after hook');

    server.close();
  });
  describe('passport local strategy', () => {
    it('should return a req a user with same id', (done) => {
      const fakeReq = {
        body: {
          username: user.username,
          password: 'abcdefg',
        },
        cookies: {
          jwt: user.token,
        },
        logIn() { },
      };
      const fakeNext = () => { };
      const fakeRes = {};
      passport.authenticate('jwt',
        (error, payload, info) => {
          try {
            assert.isNull(error);
            assert.isUndefined(info);
            assert.equal(
              payload.id.toString(),
              user._id.toString(),
              'returned user should have same _id',
            );
            console.log(payload);
            done();
          } catch (e) {
            done(e);
          }
        })(fakeReq, fakeRes, fakeNext);
    });
    it('should return a false with an error message when no user details are present', (done) => {
      const emptyToken = jwt.sign({
      }, secret);
      const wrongPassword = {
        body: {
          username: user.username,
          password: 'password',
        },
        cookies: {
          jwt: emptyToken,
        },
        logIn() { },
      };
      const fakeNext = () => { };
      const fakeRes = {};
      passport.authenticate('jwt',
        (error, payload, info) => {
          // console.log(info);
          try {
            assert.isFalse(payload);
            assert.isNull(error);
            assert.isString(info.message);
            done();
          } catch (e) {
            done(e);
          }
        })(wrongPassword, fakeRes, fakeNext);
    });
    it('should return a false with an info message when a expired token is passed in', (done) => {
      const exp = new Date('2002-12-12');
      // console.log(exp, 'exp');
      const expiredToken = jwt.sign({
        id: user._id,
        username: user.username,
        exp: parseInt(exp.getTime() / 1000, 10),
      }, secret);
      // console.log(expiredToken, 'expired token');
      const wrongUser = {
        body: {
          username: 'user.username',
          password: 'password',
        },
        cookies: {
          jwt: expiredToken,
        },
        logIn() { },
      };
      const fakeNext = () => { };
      const fakeRes = {};
      passport.authenticate('jwt',
        (error, person, info) => {
          try {
            assert.isFalse(person);
            assert.isNull(error);
            assert.isString(info.message);
            assert.instanceOf(info, jwt.TokenExpiredError);
            done();
          } catch (e) {
            done(e);
          }
        })(wrongUser, fakeRes, fakeNext);
    });
  });
});
