/**
 * Tests for error handling utilities
 */

import {
  ERROR_CODES,
  ERROR_MESSAGES,
  AppError,
  AIError,
  DatasetError,
  ValidationError,
  NotFoundError,
  classifyHuggingFaceError
} from '../../utils/errors.js';
import { HTTP_STATUS } from '../../config/constants.js';

describe('Error Utilities', () => {
  describe('AppError', () => {
    it('should create an operational error with correct properties', () => {
      const error = new AppError('Test error', 400, ERROR_CODES.VALIDATION_ERROR);

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.errorCode).toBe(ERROR_CODES.VALIDATION_ERROR);
      expect(error.isOperational).toBe(true);
    });

    it('should serialize to JSON correctly', () => {
      const error = new AppError('Test error', 400, ERROR_CODES.VALIDATION_ERROR, { field: 'email' });
      const json = error.toJSON();

      expect(json).toEqual({
        message: 'Test error',
        errorCode: ERROR_CODES.VALIDATION_ERROR,
        statusCode: 400,
        details: { field: 'email' }
      });
    });

    it('should default to internal server error', () => {
      const error = new AppError('Something went wrong');

      expect(error.statusCode).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(error.errorCode).toBe(ERROR_CODES.INTERNAL_ERROR);
    });
  });

  describe('AIError', () => {
    it('should create AI error with correct defaults', () => {
      const error = new AIError('Model failed');

      expect(error.message).toBe('Model failed');
      expect(error.errorCode).toBe(ERROR_CODES.AI_INFERENCE_FAILED);
      expect(error.statusCode).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });

    it('should accept custom error code', () => {
      const error = new AIError(
        ERROR_MESSAGES[ERROR_CODES.AI_MODEL_LOADING],
        ERROR_CODES.AI_MODEL_LOADING
      );

      expect(error.errorCode).toBe(ERROR_CODES.AI_MODEL_LOADING);
      expect(error.message).toBe(ERROR_MESSAGES[ERROR_CODES.AI_MODEL_LOADING]);
    });

    it('should include details', () => {
      const error = new AIError('Failed', ERROR_CODES.AI_RATE_LIMIT, { retryAfter: 60 });

      expect(error.details).toEqual({ retryAfter: 60 });
    });
  });

  describe('DatasetError', () => {
    it('should create dataset error with correct defaults', () => {
      const error = new DatasetError('Dataset not available');

      expect(error.message).toBe('Dataset not available');
      expect(error.errorCode).toBe(ERROR_CODES.DATASET_FETCH_FAILED);
    });

    it('should accept custom error code', () => {
      const error = new DatasetError(
        'Empty dataset',
        ERROR_CODES.DATASET_EMPTY
      );

      expect(error.errorCode).toBe(ERROR_CODES.DATASET_EMPTY);
    });
  });

  describe('ValidationError', () => {
    it('should create validation error with 400 status', () => {
      const error = new ValidationError('Invalid input');

      expect(error.message).toBe('Invalid input');
      expect(error.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(error.errorCode).toBe(ERROR_CODES.VALIDATION_ERROR);
    });

    it('should include validation details', () => {
      const error = new ValidationError('Invalid fields', {
        fields: ['email', 'password']
      });

      expect(error.details.fields).toEqual(['email', 'password']);
    });
  });

  describe('NotFoundError', () => {
    it('should create not found error with 404 status', () => {
      const error = new NotFoundError('Dataset');

      expect(error.message).toBe('Dataset not found');
      expect(error.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
      expect(error.errorCode).toBe(ERROR_CODES.NOT_FOUND);
    });

    it('should default to "Resource"', () => {
      const error = new NotFoundError();

      expect(error.message).toBe('Resource not found');
    });
  });

  describe('classifyHuggingFaceError', () => {
    it('should classify 503 as model loading error', () => {
      const error = classifyHuggingFaceError(
        { status: 503, estimated_time: 20 },
        'Model loading'
      );

      expect(error).toBeInstanceOf(AIError);
      expect(error.errorCode).toBe(ERROR_CODES.AI_MODEL_LOADING);
      expect(error.message).toBe(ERROR_MESSAGES[ERROR_CODES.AI_MODEL_LOADING]);
      expect(error.details.estimated_time).toBe(20);
    });

    it('should classify 401 as invalid token error', () => {
      const error = classifyHuggingFaceError(
        { status: 401 },
        'Unauthorized'
      );

      expect(error).toBeInstanceOf(AIError);
      expect(error.errorCode).toBe(ERROR_CODES.AI_INVALID_TOKEN);
    });

    it('should classify 403 as invalid token error', () => {
      const error = classifyHuggingFaceError(
        { status: 403 },
        'Forbidden'
      );

      expect(error.errorCode).toBe(ERROR_CODES.AI_INVALID_TOKEN);
    });

    it('should classify 429 as rate limit error', () => {
      const error = classifyHuggingFaceError(
        { status: 429 },
        'Too many requests'
      );

      expect(error.errorCode).toBe(ERROR_CODES.AI_RATE_LIMIT);
    });

    it('should classify 404 as model not found error', () => {
      const error = classifyHuggingFaceError(
        { status: 404 },
        'Not found'
      );

      expect(error.errorCode).toBe(ERROR_CODES.AI_MODEL_NOT_FOUND);
    });

    it('should default to inference failed for unknown status', () => {
      const error = classifyHuggingFaceError(
        { status: 500 },
        'Internal server error'
      );

      expect(error.errorCode).toBe(ERROR_CODES.AI_INFERENCE_FAILED);
      expect(error.details.status).toBe(500);
      expect(error.details.originalError).toBe('Internal server error');
    });

    it('should use custom error message if provided', () => {
      const error = classifyHuggingFaceError(
        { status: 500 },
        'Custom error message'
      );

      expect(error.message).toBe('Custom error message');
    });
  });

  describe('Error Messages', () => {
    it('should have messages for all error codes', () => {
      Object.values(ERROR_CODES).forEach(code => {
        expect(ERROR_MESSAGES[code]).toBeDefined();
        expect(ERROR_MESSAGES[code]).not.toBe('');
      });
    });

    it('should provide user-friendly messages', () => {
      // AI error messages should be helpful
      expect(ERROR_MESSAGES[ERROR_CODES.AI_MODEL_LOADING]).toContain('retry');
      expect(ERROR_MESSAGES[ERROR_CODES.AI_INVALID_TOKEN]).toContain('token');

      // Should not expose technical details
      expect(ERROR_MESSAGES[ERROR_CODES.INTERNAL_ERROR]).not.toContain('stack');
      expect(ERROR_MESSAGES[ERROR_CODES.INTERNAL_ERROR]).not.toContain('exception');
    });
  });
});
