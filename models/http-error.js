class HttpError extends Error {
  constructor(message, errorCode, ...args) {
    super(message); // Add a 'message' property
    this.code = errorCode; // Adds a 'code' property
    this.additionalInfo = args;
  }
}

module.exports = HttpError;
