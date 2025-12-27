module.exports = {
  // Environnement JSDOM pour tester le code manipulant le DOM
  testEnvironment: 'jsdom',

  // Babel transforme les ES6 modules en CommonJS pour Jest
  transform: {
    '^.+\\.js$': 'babel-jest',
  },

  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    'public/js/**/*.js',
    '!src/index.js',
    '!src/infrastructure/web/server.js',
    '!public/js/app.js', // Point d'entrée
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
