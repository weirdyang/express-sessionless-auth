const path = require('path');

const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');

const { errorHandler, notFoundHandler } = require('./middleware');
const { auth, router: authRouter } = require('./routes/auth.routes');
const journalRouter = require('./routes/journals.route');
const usersRouter = require('./routes/users.route');

const app = express();
require('./config/passport.js')(app);
require('./config/mongoose')();

// originService
//   .insertOrigin('vue-front', 'http://localhost:8080')
//   .then((result) => debug(result));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/journals', journalRouter);

// error for unsupported routes (which we dont want to handle)
app.use(notFoundHandler);

app.use(errorHandler);

module.exports = app;
