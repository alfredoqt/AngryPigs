/**
 * Error handling
 * 
 */

let error_handlers = {};

class ApplicationError extends Error {
  constructor(status = 500, message = 'Unknown error.') {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, ApplicationError);
  }
}

error_handlers.ApplicationError = ApplicationError;

module.exports = error_handlers;
