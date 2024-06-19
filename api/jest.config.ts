import { pathsToModuleNameMapper } from 'ts-jest'; // eslint-disable-line node/no-unpublished-import

import { compilerOptions } from './tsconfig.json';

export default {
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>',
  }),

  verbose: true,

  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/setup_tests.ts'],
};
