module.exports = {
  transform: {
    '.*\\.js$': 'babel-jest',
  },
  testTimeout: 30000, // Increase timeout to 30 seconds for e2e test
};
