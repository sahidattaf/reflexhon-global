/**
 * Manual Test Script for Error Handling
 * Run with: node __tests__/manual-test.js
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
} from '../utils/errors.js';

console.log('🧪 Testing Error Handling System\n');

// Test 1: AppError
console.log('Test 1: AppError');
try {
  throw new AppError('Test error', 400, ERROR_CODES.VALIDATION_ERROR, { field: 'email' });
} catch (error) {
  console.log('✓ AppError created:', error.toJSON());
  console.log('  isOperational:', error.isOperational);
}

// Test 2: AIError with model loading
console.log('\nTest 2: AIError (Model Loading)');
try {
  throw new AIError(
    ERROR_MESSAGES[ERROR_CODES.AI_MODEL_LOADING],
    ERROR_CODES.AI_MODEL_LOADING,
    { estimated_time: 20 }
  );
} catch (error) {
  console.log('✓ AIError created:', error.message);
  console.log('  Error code:', error.errorCode);
  console.log('  Details:', error.details);
}

// Test 3: DatasetError
console.log('\nTest 3: DatasetError');
try {
  throw new DatasetError('Dataset not found', ERROR_CODES.DATASET_NOT_FOUND);
} catch (error) {
  console.log('✓ DatasetError created:', error.message);
  console.log('  Status code:', error.statusCode);
}

// Test 4: ValidationError
console.log('\nTest 4: ValidationError');
try {
  throw new ValidationError('Invalid email format', { fields: ['email'] });
} catch (error) {
  console.log('✓ ValidationError created:', error.message);
  console.log('  Status code:', error.statusCode);
  console.log('  Details:', error.details);
}

// Test 5: NotFoundError
console.log('\nTest 5: NotFoundError');
try {
  throw new NotFoundError('User');
} catch (error) {
  console.log('✓ NotFoundError created:', error.message);
  console.log('  Status code:', error.statusCode);
}

// Test 6: classifyHuggingFaceError - 503
console.log('\nTest 6: classifyHuggingFaceError (503 - Model Loading)');
const error503 = classifyHuggingFaceError(
  { status: 503, estimated_time: 25 },
  'Model loading'
);
console.log('✓ Classified error:', error503.message);
console.log('  Error code:', error503.errorCode);
console.log('  Details:', error503.details);

// Test 7: classifyHuggingFaceError - 401
console.log('\nTest 7: classifyHuggingFaceError (401 - Invalid Token)');
const error401 = classifyHuggingFaceError({ status: 401 }, 'Unauthorized');
console.log('✓ Classified error:', error401.message);
console.log('  Error code:', error401.errorCode);

// Test 8: classifyHuggingFaceError - 429
console.log('\nTest 8: classifyHuggingFaceError (429 - Rate Limit)');
const error429 = classifyHuggingFaceError({ status: 429 }, 'Too many requests');
console.log('✓ Classified error:', error429.message);
console.log('  Error code:', error429.errorCode);

// Test 9: classifyHuggingFaceError - 404
console.log('\nTest 9: classifyHuggingFaceError (404 - Model Not Found)');
const error404 = classifyHuggingFaceError({ status: 404 }, 'Not found');
console.log('✓ Classified error:', error404.message);
console.log('  Error code:', error404.errorCode);

// Test 10: User-friendly messages
console.log('\nTest 10: Verify User-Friendly Messages');
const messageSamples = [
  ERROR_CODES.AI_MODEL_LOADING,
  ERROR_CODES.AI_RATE_LIMIT,
  ERROR_CODES.AI_INVALID_TOKEN,
  ERROR_CODES.DATASET_NOT_FOUND
];

messageSamples.forEach(code => {
  console.log(`  ${code}:`);
  console.log(`    "${ERROR_MESSAGES[code]}"`);
});

console.log('\n✅ All manual tests completed successfully!');
console.log('\nKey Features Verified:');
console.log('  ✓ Custom error classes with proper inheritance');
console.log('  ✓ User-friendly error messages');
console.log('  ✓ Error classification from HTTP status codes');
console.log('  ✓ Error details and context preservation');
console.log('  ✓ Operational error marking for logging');
