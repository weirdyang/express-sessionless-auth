class HttpError extends Error {
  constructor(message, errorCode, ...args) {
    super(message); // Add a 'message' property
    this.code = errorCode; // Adds a 'code' property
    if (args) {
      this.additionalInfo = [...args[0]];
    }
  }
}

module.exports = HttpError;
