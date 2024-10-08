import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:8080/api/graphql',
  documents: ['src/graphql/**/*.ts'],
  // For extensions in import statements of generated files
  emitLegacyCommonJSImports: false,
  verbose: true,
  generates: {
    'src/graphql/__generated__/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
};

export default config;
