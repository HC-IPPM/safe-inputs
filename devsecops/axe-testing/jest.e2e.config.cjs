module.exports = {
  displayName: 'e2e',
  testMatch: ['<rootDir>/tests/*.test.js'], // Match unit tests
  transform: {
    '.*\\.js$': 'babel-jest',
  },
  testTimeout: 60000, // Increase timeout for e2e test
};
