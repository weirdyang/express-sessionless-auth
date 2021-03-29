const debug = require('debug')('app:mocha:hook');
const mongoose = require('mongoose');

const setUpMongoose = require('../config/mongoose');

exports.mochaHooks = {

  afterAll: async () => {
    setUpMongoose();
    try {
      await mongoose.connection.db.dropCollection('users');
      await mongoose.connection.db.dropCollection('journals');
    } catch (error) {
      console.error(error);
      console.log('collections not dropped');
    }
  },
};
