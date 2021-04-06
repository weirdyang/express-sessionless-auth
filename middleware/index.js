const HttpError = require('../models/http-error');

function middleware() {
  const errorHandler = (error, req, res, next) => {
    if (res.headerSent) {
      return next(error);
    }
    if (error instanceof HttpError) {
      const errorMessage = {
        message: error.message,
      };
      if (error.additionalInfo) {
        errorMessage.additionalInfo = error.additionalInfo;
      }
      return res.status(error.code).json(errorMessage);
    }
    res.status(500);
    return res.json({ message: error.message || 'An unknown error occured!' });
  };

  const notFoundHandler = (req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    return next(error);
  };

  const uniqueValidationErrorHandler = (err, req, res, next) => {
    if (err.name === 'ValidationError') {
      return res.status(422).json({
        errors: Object.keys(err.errors).reduce((errors, key) => {
          const message = errors;
          message[key] = err.errors[key].message;

          return message;
        }, {}),
      });
    }

    return next(err);
  };

  return {
    notFoundHandler,
    errorHandler,
    uniqueValidationErrorHandler,
  };
}

module.exports = middleware();
