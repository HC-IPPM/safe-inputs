module.exports = {
  displayName: 'unit',
  testMatch: ['<rootDir>/src/*.test.js'],
  transform: {
    '.*\\.js$': 'babel-jest',
  },
};
