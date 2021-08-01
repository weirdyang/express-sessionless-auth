const errorFormatter = ({
  location, msg, param, value, nestedErrors,
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
module.exports = {
  errorFormatter,
  mongooseErrorFormatter,
};
