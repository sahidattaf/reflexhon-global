/**
 * Tests for Error Handler Middleware
 */

import { errorHandler } from '../../middleware/errorHandler.js';
import {
  AppError,
  AIError,
  DatasetError,
  ValidationError,
  NotFoundError,
  ERROR_CODES
} from '../../utils/errors.js';
import { HTTP_STATUS } from '../../config/constants.js';

// Mock logger
jest.mock('../../utils/logger.js', () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn()
  }
}));

import { logger } from '../../utils/logger.js';

describe('Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      path: '/test',
      method: 'GET'
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();

    jest.clearAllMocks();

    // Save original NODE_ENV
    process.env.NODE_ENV = 'test';
  });

  describe('Operational Errors', () => {
    it('should handle AIError with user-friendly message', () => {
      const error = new AIError(
        'Model is loading',
        ERROR_CODES.AI_MODEL_LOADING,
        { estimated_time: 20 }
      );

      errorHandler(error, req, res, next);

      expect(logger.warn).toHaveBeenCalledWith(
        'Operational error occurred:',
        expect.objectContaining({
          errorCode: ERROR_CODES.AI_MODEL_LOADING,
          message: 'Model is loading'
        })
      );

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Model is loading',
          errorCode: ERROR_CODES.AI_MODEL_LOADING,
          details: { estimated_time: 20 }
        }
      });
    });

    it('should handle DatasetError', () => {
      const error = new DatasetError(
        'Dataset not found',
        ERROR_CODES.DATASET_NOT_FOUND
      );

      errorHandler(error, req, res, next);

      expect(logger.warn).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            errorCode: ERROR_CODES.DATASET_NOT_FOUND
          })
        })
      );
    });

    it('should handle ValidationError with 400 status', () => {
      const error = new ValidationError('Invalid input', {
        fields: ['email']
      });

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Invalid input',
          errorCode: ERROR_CODES.VALIDATION_ERROR,
          details: { fields: ['email'] }
        }
      });
    });

    it('should handle NotFoundError with 404 status', () => {
      const error = new NotFoundError('Dataset');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Dataset not found',
          errorCode: ERROR_CODES.NOT_FOUND
        }
      });
    });
  });

  describe('Unexpected Errors', () => {
    it('should handle generic Error with safe message', () => {
      const error = new Error('Internal database failure');

      errorHandler(error, req, res, next);

      expect(logger.error).toHaveBeenCalledWith(
        'Unexpected error occurred:',
        expect.objectContaining({
          error: 'Internal database failure'
        })
      );

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'An unexpected error occurred. Please try again later.',
          errorCode: ERROR_CODES.INTERNAL_ERROR
        }
      });
    });

    it('should not expose internal error details in production', () => {
      process.env.NODE_ENV = 'production';

      const error = new Error('Database connection string: postgres://secret');

      errorHandler(error, req, res, next);

      const response = res.json.mock.calls[0][0];

      expect(response.error.message).not.toContain('postgres://');
      expect(response.error.message).not.toContain('secret');
      expect(response.error.stack).toBeUndefined();
    });
  });

  describe('Development Mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should include stack trace in development', () => {
      const error = new AppError('Test error', 500, ERROR_CODES.INTERNAL_ERROR);

      errorHandler(error, req, res, next);

      const response = res.json.mock.calls[0][0];

      expect(response.error.stack).toBeDefined();
      expect(response.error.originalMessage).toBe('Test error');
    });

    it('should include original message for operational errors', () => {
      const error = new AIError('Custom AI error');

      errorHandler(error, req, res, next);

      const response = res.json.mock.calls[0][0];

      expect(response.error.originalMessage).toBe('Custom AI error');
    });
  });

  describe('Error Context', () => {
    it('should log request path and method', () => {
      const error = new AppError('Test', 500, ERROR_CODES.INTERNAL_ERROR);

      errorHandler(error, req, res, next);

      expect(logger.warn).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          path: '/test',
          method: 'GET'
        })
      );
    });

    it('should handle errors without details', () => {
      const error = new AIError('Simple error');

      errorHandler(error, req, res, next);

      const response = res.json.mock.calls[0][0];

      expect(response.error.details).toBeUndefined();
    });

    it('should default to 500 for errors without statusCode', () => {
      const error = { message: 'Unknown error' };

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });
  });

  describe('Response Format', () => {
    it('should always return success: false', () => {
      const error = new AppError('Test');

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false
        })
      );
    });

    it('should include error object with message and code', () => {
      const error = new ValidationError('Invalid data');

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          message: expect.any(String),
          errorCode: expect.any(String)
        })
      });
    });

    it('should handle errors with custom details', () => {
      const error = new AIError(
        'Rate limit',
        ERROR_CODES.AI_RATE_LIMIT,
        { retryAfter: 60, limit: 100 }
      );

      errorHandler(error, req, res, next);

      const response = res.json.mock.calls[0][0];

      expect(response.error.details).toEqual({
        retryAfter: 60,
        limit: 100
      });
    });
  });
});
