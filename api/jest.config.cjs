const { pathsToModuleNameMapper } = require('ts-jest'); // eslint-disable-line n/no-unpublished-require

const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  // api specific
  testEnvironment: 'node',
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./src/setup_tests.ts'],
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['.test.ts'],

  // common with /ui jest config
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
  verbose: true,
};
