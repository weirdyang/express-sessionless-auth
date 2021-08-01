const HttpError = require('../models/http-error');

const errorFormatter = ({
  msg, param,
}) => ({
  name: param,
  error: msg,
});
const mongooseErrorFormatter = (error) => Object.keys(error.errors).reduce((errors, key) => {
  const message = errors;
  const newError = {
    name: key,
    error: error.errors[key].message,
  };
  message.push(newError);
  return message;
}, []);

const handleError = (error, next) => {
  if (error.name === 'ValidationError') {
    return next(
      new HttpError('Invalid inputs passed, please check your data',
        422,
        mongooseErrorFormatter(error)),
    );
  }
  return next(
    new HttpError(error.message, 500),
  );
};
module.exports = {
  errorFormatter,
  mongooseErrorFormatter,
  handleError,
};
