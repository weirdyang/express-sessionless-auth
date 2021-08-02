/* eslint-disable no-underscore-dangle */
// Import the dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const passport = require('passport');
const sinon = require('sinon');

// const productId = config.productId;
const app = require('../../app');
const { PORT } = require('../../config');
const { User } = require('../../models/user');
// Configure chai
chai.use(chaiHttp);
chai.should();
const { expect } = chai;
const user = new User({
  username: '2qsdax',
  password: 'asdzxczxc',
  email: 'asdasdasd@email.com',
  avatar: 'leaf',
});

describe('users', () => {
  console.log(process.env.NODE_ENV);
  let server;
  before(async () => {
    // console.log(user._id);
    sinon.stub(passport, 'authenticate').returns((req, res, next) => next());
    server = app.listen(PORT,
      () => console.log(`Your server is running on port ${PORT}`));
    await user.save();
  });
  after(async () => {
    // console.log('after hook');
    passport.authenticate.restore();
    server.close();
  });

  describe('GET / route', () => {
    it('should return status 200 when logged in', (done) => {
      chai.request(server)
        .get('/users/')
        .end((err, res) => {
          expect(res)
            .to
            .have
            .status(200);
          done();
        });
    });
    it('should return an array on success', (done) => {
      chai.request(server)
        .get('/users')
        .end((err, res) => {
          res
            .body
            .users
            .should
            .be.an('array');
          done();
        });
    });
  });

  describe('GET /single/:id', () => {
    it('should return 200 when logged in', (done) => {
      // console.log(user._id);
      chai.request(server)
        .get(`/users/single/${user._id}`)
        .end((err, res) => {
          expect(res)
            .to
            .have
            .status(200);
          done();
        });
    });
    it('should return 404 when passed in non-existent user id', (done) => {
    //  console.log(user._id);
      chai.request(server)
        .get('/users/single/605cb85363b3401cac3c3b2b')
        .end((err, res) => {
          expect(res)
            .to
            .have
            .status(404);
          done();
        });
    });
    it('should return 500 when passed in an id in the wrong format', (done) => {
      // console.log(user._id);
      chai.request(server)
        .get('/users/single/wrongFormatId')
        .end((err, res) => {
          expect(res)
            .to
            .have
            .status(500);
          done();
        });
    });
  });
});
