const debug = require('debug')('app:config:mongoose');
const mongoose = require('mongoose');

const connectionString = process.env.MONGO_DB || 'mongodb://localhost/authBackEnd';

function mongooseSetUp() {
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
}

module.exports = mongooseSetUp;
