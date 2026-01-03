export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!jest.config.js',
    '!server.js'
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  // Exclude tests that require ES module mocking for now
  testPathIgnorePatterns: [
    '/node_modules/',
    '__tests__/services/reflexion.test.js',
    '__tests__/services/datasets.test.js',
    '__tests__/services/huggingface.test.js',
    '__tests__/middleware/errorHandler.test.js'
  ]
};
