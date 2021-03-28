const errorFormatter = ({
  location, msg, param, value, nestedErrors,
}) => `${location}[${param}]: ${msg}`;

module.exports = {
  errorFormatter,
};
