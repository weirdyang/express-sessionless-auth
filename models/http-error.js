class HttpError extends Error {
  constructor(message, errorCode, ...args) {
    super(message); // Add a 'message' property
    this.code = errorCode; // Adds a 'code' property
    console.log(args);
    if (args && args.length) {
      this.additionalInfo = [...args[0]];
    }
  }
}

module.exports = HttpError;
