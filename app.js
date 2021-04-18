const path = require('path');

require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const csrf = require('csurf');
const debug = require('debug')('app');
const express = require('express');
const logger = require('morgan');

const csrfProtection = csrf({ cookie: true });
const { errorHandler, notFoundHandler } = require('./middleware');
const { router: authRouter } = require('./routes/auth.routes');
const journalRouter = require('./routes/journals.route');
const usersRouter = require('./routes/users.route');

const app = express();
require('./config/passport.js')(app);
require('./config/mongoose')();

// originService
//   .insertOrigin('vue-front', 'http://localhost:8080')
//   .then((result) => debug(result));
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
debug(process.env.CLIENT_URL);
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(csrfProtection);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/journals', journalRouter);

// error for unsupported routes (which we dont want to handle)
app.use(notFoundHandler);

app.use(errorHandler);

module.exports = app;
