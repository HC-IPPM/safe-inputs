import { CodegenConfig } from '@graphql-codegen/cli';

const GRAPHQL_API_URL =
  process.env.GRAPHQL_API_URL || 'http://localhost:8080/api/graphql';

const config: CodegenConfig = {
  schema: GRAPHQL_API_URL,
  documents: ['src/graphql/**/*.ts'],
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
