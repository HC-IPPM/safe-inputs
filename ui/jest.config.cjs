const { pathsToModuleNameMapper } = require('ts-jest');

const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  // ui specific
  testEnvironment: 'jsdom',
  transform: {
    '\\.(ts|tsx)$': 'babel-jest',
  },
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx'],
  coveragePathIgnorePatterns: [
    '.test.ts',
    '.test.tsx',
    'i18n/locales',
    'test_utils',
  ],
  coverageDirectory: '<rootDir>/ui/coverage',
  coverageReporters: ['json', 'text'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/test_utils/mocks/styleMock.js',
    '\\.svg$': '<rootDir>/src/test_utils/mocks/svgMock.js',
    // next line is also common between /ui and /api
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>',
    }),
  },

  // common with /api jest config
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  verbose: true,
};
