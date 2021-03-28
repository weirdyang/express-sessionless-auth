/* eslint-disable no-underscore-dangle */
// Import the dependencies for testing
const { assert } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
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
chai.use(chaiHttp);
const journal = new Journal({
  title: 'test',
  entry: 'hello',
  dateOfEntry: '2002-12-09',
});
const user = new User({
  email: 'abcdef@abcdef.com',
  password: '123456',
  username: 'abcdef',
});

let deleteId;
describe('journals', () => {
  let server;
  before(async () => {
    console.log(user._id);
    sinon.stub(passport, 'authenticate').returns((req, res, next) => {
      req.user = user;
      req.user.id = user._id;
      next();
    });
    server = app.listen(PORT,
      () => console.log(`Your server is running on port ${PORT}`));
    await user.save();
    journal.user = user;
    await journal.save();
  });
  after(async () => {
    console.log('after hook');
    passport.authenticate.restore();
    mongoose.connection.dropDatabase();
    server.close();
  });

  describe('GET / route', () => {
    it('should return status 200', (done) => {
      chai.request(server)
        .get('/journals')
        .end((err, res) => {
          expect(res)
            .to
            .have
            .status(200);
          done();
        });
    });
    it('should return an array', (done) => {
      chai.request(server)
        .get('/journals')
        .end((err, res) => {
          res
            .body
            .journals
            .should
            .be.an('array');
          done();
        });
    });
  });

  describe('GET /:id', () => {
    it('should return 200', (done) => {
      console.log(user._id);
      chai.request(server)
        .get(`/journals/${journal._id}`)
        .end(async (err, res) => {
          expect(res)
            .to
            .have
            .status(200);
          try {
            assert
              .equal(
                res.body.journals.title,
                journal.title,
                'journal titles should be the same',
              );
            done();
          } catch (error) {
            done(error);
          }
        });
    });
    it('should return an empty array with status 200', (done) => {
      chai.request(server)
        .get('/journals/605cb85363b3401cac3c3b2b')
        .end((err, res) => {
          expect(res
            .body
            .journals).to.be.a('null');
          expect(res).to.have.status(200);
          done();
        });
    });
    it('should return 500', (done) => {
      console.log(user._id);
      chai.request(server)
        .get('/journals/wrongFormatId')
        .end((err, res) => {
          expect(res)
            .to
            .have
            .status(500);
          done();
        });
    });
  });

  describe('POST /create', () => {
    it('should return 200', (done) => {
      chai.request(server)
        .post('/journals/create')
        .send({
          title: 'kkoooo',
          entry: 'my entryasdasd',
          dateOfEntry: '2002-12-09',
          user: user._id,
        })
        .end((err, res) => {
          console.log(res.body);
          expect(res)
            .to
            .have
            .status(200);
          deleteId = res.body.journal._id;
          done();
        });
    });
    it('should return 422', (done) => {
      chai.request(server)
        .post('/journals/create')
        .send({
          title: 'invalid data',
        })
        .end((err, res) => {
          console.log(res.body);
          expect(res)
            .to
            .have
            .status(422);
          done();
        });
    });
  });

  describe('GET /user/:id', () => {
    it('should return status 200 and an array', (done) => {
      chai.request(server)
        .get(`/journals/user/${user._id}`)
        .end((err, res) => {
          expect(res
            .body.journals).to.be.an('array');
          expect(res).to.have.status(200);
          done();
        });
    });
  });
  describe('DELETE /:id', () => {
    it('should return status 404', (done) => {
      chai.request(server)
        .delete(`/journals/${user._id}`)
        .end((err, res) => {
          assert
            .equal(res.body.message,
              'no such journal',
              'should return with message "no such journal"');
          expect(res).to.have.status(404);
          done();
        });
    });
    it('should return status 200 with a journal', (done) => {
      chai.request(server)
        .delete(`/journals/${deleteId}`)
        .end((err, res) => {
          assert
            .equal(res.body.journal._id,
              deleteId,
              'should return journal with same -id');
          expect(res).to.have.status(200);
          done();
        });
    });
  });
  describe('PUT /:id', () => {
    it('should return 200', (done) => {
      chai.request(server)
        .put(`/journals/${journal._id}`)
        .send({
          title: 'hello',
          entry: 'new entry',
          dateOfEntry: '2020-12-12',
        }).end((err, res) => {
          assert.isNull(err);
          expect(res).to.have.status(200);
          assert.equal(res.body.journal.title, 'hello');
          assert.equal(res.body.journal.entry, 'new entry');
          done();
        });
    });
    it('should return 422', (done) => {
      chai.request(server)
        .put(`/journals/${journal._id}`)
        .send({
        }).end((err, res) => {
          expect(res).to.have.status(422);
          done(err);
        });
    });
  });
});
