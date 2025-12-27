module.exports = {
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.js$': 'babel-jest',
  },

  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/backend/**/*.js',
    'src/frontend/**/*.js',
    '!src/backend/infrastructure/web/server.js',
    '!src/frontend/js/app.js',
    '!**/node_modules/**',
    '!**/coverage/**',
  ],
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: ['**/tests/**/*.test.js'],
};
