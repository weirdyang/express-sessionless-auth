/* eslint-disable no-underscore-dangle */
// Import the dependencies for testing
const { assert } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const passport = require('passport');
const sinon = require('sinon');

// const productId = config.productId;
const app = require('../../app');
const { PORT } = require('../../config');
const Journal = require('../../models/journal');
const User = require('../../models/user');
// Configure chai
chai.use(chaiHttp);
chai.should();
const { expect } = chai;
const user = {
  username: 'authtest',
  password: 'authtest',
  email: 'abcde@email.com',
};

describe('users', () => {
  let server;
  before(async () => {
    // console.log(user._id);
    server = app.listen(PORT,
      () => console.log(`Your server is running on port ${PORT}`));
    // await user.save();
  });
  after(async () => {
    // console.log('after hook');
    await User.remove().exec();
    await Journal.remove().exec();
    server.close();
  });

  describe('POST /register route', () => {
    it('should return status 422 when passed in an empty body', (done) => {
      chai.request(server)
        .post('/auth/register')
        .send({})
        .end((err, res) => {
          expect(res)
            .to
            .have
            .status(422);
          done();
        });
    });
    it('should return status 200 and a message on success', (done) => {
      chai.request(server)
        .post('/auth/register')
        .send(user)
        .end((err, res) => {
          res
            .body
            .message
            .should
            .be.a('string');

          expect(res).to.have.status(200);
          done();
        });
    });
  });
  describe('POST /login route', () => {
    it('should return status 422 when passed in an empty body', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({})
        .end((err, res) => {
          expect(res)
            .to
            .have
            .status(422);
          done();
        });
    });
    it('should return status 200 and correct user properties on success', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send(user)
        .end((err, res) => {
          assert.equal(res.body.user.email, user.email);
          assert.equal(res.body.user.username, user.username);

          expect(res).to.have.status(200);
          done();
        });
    });
  });
});
