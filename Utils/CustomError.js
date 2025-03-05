class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;

    this.status = 500 > statusCode && statusCode >= 400 ? "fail" : "error";

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
