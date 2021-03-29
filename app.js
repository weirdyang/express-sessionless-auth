const path = require('path');

const cookieParser = require('cookie-parser');
const debug = require('debug')('app:server');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');

const { errorHandler, notFoundHandler } = require('./middleware');
const { auth, router: authRouter } = require('./routes/auth.routes');
const journalRouter = require('./routes/journals.route');
const usersRouter = require('./routes/users.route');s

const app = express();
require('./config/passport.js')(app);
// mongoose setup
// mongoose.connect(`${config.mongoUrl}/${config.databaseName}`, mongooseOptions);
// catch to catch initial connection error
// 2.tcp.ngrok.io:13741
const connectionString = process.env.MONGO_DB || 'mongodb://localhost/authBackEnd';

debug(connectionString, 'connection string');
// catch to catch initial connection error
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
}).catch((err) => {
  debug(err, 'cannot connect');
});
mongoose.connection.on('error', (error) => {
  debug(error);
});

// originService
//   .insertOrigin('vue-front', 'http://localhost:8080')
//   .then((result) => debug(result));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', auth.jwt, usersRouter);
app.use('/auth', authRouter);
app.use('/journals', journalRouter);

// error for unsupported routes (which we dont want to handle)
app.use(notFoundHandler);

app.use(errorHandler);

module.exports = app;
