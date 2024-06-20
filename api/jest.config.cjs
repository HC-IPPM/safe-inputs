const { pathsToModuleNameMapper } = require('ts-jest'); // eslint-disable-line node/no-unpublished-require

const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  // api specific
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/setup_tests.ts'],

  // common
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
  verbose: true,
};
