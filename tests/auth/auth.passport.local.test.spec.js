/* eslint-disable no-underscore-dangle */
// Import the dependencies for testing
const { assert } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const passport = require('passport');

// const productId = config.productId;
const app = require('../../app');
const { PORT } = require('../../config');
const User = require('../../models/user');
// Configure chai
chai.use(chaiHttp);
chai.should();
const originalPassword = 'sdfsdfsdf';
const user = new User({
  username: 'sdfsdfsdf',
  password: 'sdfsdfsdf',
  avatar: 'leaf',
  email: 'sdfsdfsdf@email.com',
});

describe('passport local strategy', () => {
  let server;
  before(async () => {
    server = app.listen(PORT,
      () => console.log(`Your server is running on port ${PORT}`));
    await user.save();
  });
  after(async () => {
    console.log('after hook');

    server.close();
  });
  describe('passport local strategy', () => {
    it('should return a response with a user with same id', (done) => {
      const fakeReq = {
        body: {
          username: user.username,
          password: originalPassword,
        },
        logIn() { },
      };
      const fakeNext = () => { };
      const fakeRes = {};
      passport.authenticate('local',
        (error, person, info) => {
          try {
            assert.isNull(error);
            assert.isUndefined(info);
            assert.equal(
              person._id.toString(),
              user._id.toString(),
              'returned user should have same _id',
            );
            done();
          } catch (e) {
            done(e);
          }
        })(fakeReq, fakeRes, fakeNext);
    });
    it('should return a false with an error message when an incorrect password is sent', (done) => {
      const wrongPassword = {
        body: {
          username: user.username,
          password: 'password',
        },
        logIn() { },
      };
      const fakeNext = () => { };
      const fakeRes = {};
      passport.authenticate('local',
        (error, person, info) => {
          try {
            assert.isFalse(person);
            assert.isNull(error);
            assert.isString(info.message);
            done();
          } catch (e) {
            done(e);
          }
        })(wrongPassword, fakeRes, fakeNext);
    });
    it('should return a false with an error message when a non-existent user is passed in', (done) => {
      const wrongUser = {
        body: {
          username: 'user.username',
          password: 'password',
        },
        logIn() { },
      };
      const fakeNext = () => { };
      const fakeRes = {};
      passport.authenticate('local',
        (error, person, info) => {
          try {
            assert.isFalse(person);
            assert.isNull(error);
            assert.isString(info.message);
            done();
          } catch (e) {
            done(e);
          }
        })(wrongUser, fakeRes, fakeNext);
    });
  });
});
