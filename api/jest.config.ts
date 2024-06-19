export default {
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  setupFilesAfterEnv: ['./src/setup_tests.ts'],
  verbose: true,

  moduleNameMapper: {
    '^@src/(.*)$': './src/$1',
  },
};
