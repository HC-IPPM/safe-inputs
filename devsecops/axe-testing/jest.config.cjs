module.exports = {
  transform: {
    '.*\\.js$': 'babel-jest',
  },
  testTimeout: 60000, // Increase timeout for e2e test
};
