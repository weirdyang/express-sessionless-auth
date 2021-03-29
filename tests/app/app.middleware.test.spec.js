/* eslint-disable no-underscore-dangle */
// Import the dependencies for testing
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');
const sinon = require('sinon');

const { PORT } = require('../../config');
const middleware = require('../../middleware');

// const productId = config.productId;

chai.use(chaiHttp);
chai.should();

let server;
let app;
describe('app errorhandler middleware test', () => {
  beforeEach(async () => {
    app = express();
  });
  afterEach(async () => {
    console.log('after hook');
    server.close();
  });
  it('should return 404 for non-existent route', (done) => {
    try {
      app.use(middleware.notFoundHandler);
      app.use(middleware.errorHandler);
      server = app.listen(PORT);
      chai.request(server)
        .get('/weird')
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(404);
          done();
        });
    } catch (error) {
      done(error);
    }
  });
  it('should return 500 for uncaught exception', (done) => {
    try {
      app.use(middleware.errorHandler);
      app.use('/error', (req, res) => {
        throw new Error('error!');
      });
      server = app.listen(PORT);
      chai.request(server)
        .get('/error')
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(500);
          done();
        });
    } catch (error) {
      done(error);
    }
  });
});
