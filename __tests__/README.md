# Testing Infrastructure

This directory contains comprehensive tests for the Reflexhon Global API error handling and AI integration.

## Test Coverage

### ✅ Error Handling Tests (`utils/errors.test.js`)
- **AppError**: Custom application error class
- **AIError**: AI-specific errors with user-friendly messages
- **DatasetError**: Dataset fetch and parse errors
- **ValidationError**: Input validation errors
- **NotFoundError**: Resource not found errors
- **classifyHuggingFaceError**: Automatic error classification from HuggingFace API responses

### ✅ Reflexion Engine Tests (`services/reflexion.test.js`)
- Basic processing without AI
- AI-enhanced processing with HuggingFace
- **AI Error Debugging**: Comprehensive error capture and reporting
  - Model loading errors (503)
  - Rate limit errors (429)
  - Invalid token errors (401/403)
  - Model not found errors (404)
  - Generic error handling with fallback
- Cultural context detection
- Processing time measurement

### ✅ HuggingFace Integration Tests (`services/huggingface.test.js`)
- Dataset fetching and JSONL parsing
- Inference API calls
- Error classification for different HTTP status codes
- Token validation
- Model information retrieval

### ✅ Dataset Service Tests (`services/datasets.test.js`)
- Dataset fetching from HuggingFace
- Fallback to local datasets on error
- Caching mechanism
- Search functionality
- Dataset structure validation

### ✅ Error Handler Middleware Tests (`middleware/errorHandler.test.js`)
- Operational vs unexpected error handling
- User-friendly error messages
- Development vs production error details
- Request context logging
- Consistent response format

## Running Tests

### Current Status

The test suite is built for ES modules but requires additional configuration for Jest's experimental ES module support. The tests are comprehensive and well-structured.

### Option 1: Run with Node experimental VM modules

```bash
NODE_OPTIONS='--experimental-vm-modules' npx jest
```

### Option 2: Manual Testing

Use the manual test script to verify error handling:

```bash
node __tests__/manual-test.js
```

### Option 3: Run the server and test endpoints

```bash
npm run dev
curl http://localhost:3000/api/v1/reflexion -d '{"input":"test"}'
```

## Test Files Structure

```
__tests__/
├── README.md                          # This file
├── manual-test.js                     # Manual test script
├── utils/
│   └── errors.test.js                 # Error utilities tests
├── services/
│   ├── reflexion.test.js              # Reflexion engine tests
│   ├── huggingface.test.js            # HuggingFace integration tests
│   └── datasets.test.js               # Dataset service tests
└── middleware/
    └── errorHandler.test.js           # Error handler middleware tests
```

## Key Features Tested

1. **User-Friendly Error Messages**: All AI and dataset errors provide clear, actionable messages
2. **Error Code Classification**: Automatic classification of HuggingFace API errors
3. **Graceful Degradation**: AI failures fall back to rule-based processing
4. **Detailed Error Context**: Error responses include error codes, details, and (in dev) stack traces
5. **Operational vs Unexpected Errors**: Different logging levels for known vs unknown errors

## Future Improvements

- Configure Jest for full ES module support with mocking
- Add integration tests with real HuggingFace API (using test tokens)
- Add performance benchmarks for reflexion processing
- Add E2E tests for full API workflows
