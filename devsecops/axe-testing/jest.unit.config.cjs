module.exports = {
  displayName: 'unit',
  testMatch: ['<rootDir>/src/*.unit.test.js'],
  transform: {
    '.*\\.js$': 'babel-jest',
  },
};
