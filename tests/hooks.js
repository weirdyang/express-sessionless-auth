const mongoose = require('mongoose');
const debug = require('debug')('app:mocha:hook');

exports.mochaHooks = {

  afterAll: async () => {
    const connectionString = process.env.MONGO_DB || 'mongodb://localhost/authBackEnd';

    debug(connectionString, 'connection string');
    // catch to catch initial connection error
    mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }).catch((err) => {
      debug(err, 'cannot connect');
    });
    mongoose.connection.on('error', (error) => {
      debug(error);
    });
    try {
      await mongoose.connection.db.dropCollection('users');
      await mongoose.connection.db.dropCollection('journals');
    } catch (error) {
      console.error(error);
      console.log('collections not dropped');
    }
  },
};
