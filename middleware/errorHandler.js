import { HTTP_STATUS } from '../config/constants.js';
import { AppError, ERROR_CODES, ERROR_MESSAGES } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, _next) => {
  // Log error with appropriate level
  if (err.isOperational) {
    logger.warn('Operational error occurred:', {
      errorCode: err.errorCode,
      message: err.message,
      path: req.path,
      method: req.method
    });
  } else {
    logger.error('Unexpected error occurred:', {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method
    });
  }

  // Determine status code and error details
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const errorCode = err.errorCode || ERROR_CODES.INTERNAL_ERROR;

  // Use user-friendly message for known errors
  const message = err.isOperational
    ? err.message
    : ERROR_MESSAGES[ERROR_CODES.INTERNAL_ERROR];

  // Build error response
  const errorResponse = {
    success: false,
    error: {
      message,
      errorCode,
      ...(err.details && { details: err.details })
    }
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
    errorResponse.error.originalMessage = err.message;
  }

  res.status(statusCode).json(errorResponse);
};
