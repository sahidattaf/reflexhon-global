/**
 * Error Codes and Custom Error Classes
 * Provides structured error handling with user-friendly messages
 */

import { HTTP_STATUS } from '../config/constants.js';

/**
 * Error codes for different failure scenarios
 */
export const ERROR_CODES = {
  // General errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',

  // AI/HuggingFace errors
  AI_MODEL_LOADING: 'AI_MODEL_LOADING',
  AI_INFERENCE_FAILED: 'AI_INFERENCE_FAILED',
  AI_INVALID_TOKEN: 'AI_INVALID_TOKEN',
  AI_RATE_LIMIT: 'AI_RATE_LIMIT',
  AI_MODEL_NOT_FOUND: 'AI_MODEL_NOT_FOUND',
  AI_TIMEOUT: 'AI_TIMEOUT',

  // Dataset errors
  DATASET_FETCH_FAILED: 'DATASET_FETCH_FAILED',
  DATASET_PARSE_ERROR: 'DATASET_PARSE_ERROR',
  DATASET_NOT_FOUND: 'DATASET_NOT_FOUND',
  DATASET_EMPTY: 'DATASET_EMPTY',

  // Configuration errors
  CONFIG_MISSING: 'CONFIG_MISSING',
  CONFIG_INVALID: 'CONFIG_INVALID'
};

/**
 * User-friendly error messages
 */
export const ERROR_MESSAGES = {
  [ERROR_CODES.INTERNAL_ERROR]: 'An unexpected error occurred. Please try again later.',
  [ERROR_CODES.VALIDATION_ERROR]: 'The provided data is invalid.',
  [ERROR_CODES.NOT_FOUND]: 'The requested resource was not found.',

  // AI errors with helpful guidance
  [ERROR_CODES.AI_MODEL_LOADING]: 'The AI model is currently loading. Please retry in a few seconds.',
  [ERROR_CODES.AI_INFERENCE_FAILED]: 'Failed to generate AI response. Using fallback processing.',
  [ERROR_CODES.AI_INVALID_TOKEN]: 'Invalid HuggingFace API token. Please check your configuration.',
  [ERROR_CODES.AI_RATE_LIMIT]: 'AI service rate limit reached. Please try again shortly.',
  [ERROR_CODES.AI_MODEL_NOT_FOUND]: 'The specified AI model was not found on HuggingFace.',
  [ERROR_CODES.AI_TIMEOUT]: 'AI inference took too long. Please try again.',

  // Dataset errors
  [ERROR_CODES.DATASET_FETCH_FAILED]: 'Failed to fetch dataset from HuggingFace.',
  [ERROR_CODES.DATASET_PARSE_ERROR]: 'Failed to parse dataset format.',
  [ERROR_CODES.DATASET_NOT_FOUND]: 'The requested dataset was not found.',
  [ERROR_CODES.DATASET_EMPTY]: 'The dataset contains no data.',

  // Config errors
  [ERROR_CODES.CONFIG_MISSING]: 'Required configuration is missing.',
  [ERROR_CODES.CONFIG_INVALID]: 'Configuration values are invalid.'
};

/**
 * Base Application Error
 */
export class AppError extends Error {
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errorCode = ERROR_CODES.INTERNAL_ERROR, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true; // Indicates this is a known error
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      message: this.message,
      errorCode: this.errorCode,
      statusCode: this.statusCode,
      ...(this.details && { details: this.details })
    };
  }
}

/**
 * AI-related errors
 */
export class AIError extends AppError {
  constructor(message, errorCode = ERROR_CODES.AI_INFERENCE_FAILED, details = null) {
    super(
      message || ERROR_MESSAGES[errorCode],
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode,
      details
    );
  }
}

/**
 * Dataset-related errors
 */
export class DatasetError extends AppError {
  constructor(message, errorCode = ERROR_CODES.DATASET_FETCH_FAILED, details = null) {
    super(
      message || ERROR_MESSAGES[errorCode],
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode,
      details
    );
  }
}

/**
 * Validation errors
 */
export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(
      message || ERROR_MESSAGES[ERROR_CODES.VALIDATION_ERROR],
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.VALIDATION_ERROR,
      details
    );
  }
}

/**
 * Not found errors
 */
export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(
      `${resource} not found`,
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.NOT_FOUND
    );
  }
}

/**
 * Helper function to classify HuggingFace API errors
 */
export function classifyHuggingFaceError(response, errorMessage) {
  const status = response?.status;

  if (status === 503) {
    return new AIError(
      ERROR_MESSAGES[ERROR_CODES.AI_MODEL_LOADING],
      ERROR_CODES.AI_MODEL_LOADING,
      { estimated_time: response.estimated_time }
    );
  }

  if (status === 401 || status === 403) {
    return new AIError(
      ERROR_MESSAGES[ERROR_CODES.AI_INVALID_TOKEN],
      ERROR_CODES.AI_INVALID_TOKEN
    );
  }

  if (status === 429) {
    return new AIError(
      ERROR_MESSAGES[ERROR_CODES.AI_RATE_LIMIT],
      ERROR_CODES.AI_RATE_LIMIT
    );
  }

  if (status === 404) {
    return new AIError(
      ERROR_MESSAGES[ERROR_CODES.AI_MODEL_NOT_FOUND],
      ERROR_CODES.AI_MODEL_NOT_FOUND
    );
  }

  // Generic inference failure
  return new AIError(
    errorMessage || ERROR_MESSAGES[ERROR_CODES.AI_INFERENCE_FAILED],
    ERROR_CODES.AI_INFERENCE_FAILED,
    { status, originalError: errorMessage }
  );
}
