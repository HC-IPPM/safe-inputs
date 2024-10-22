import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema:
    process.env.GRAPHQL_ENDPOINT_URL ?? 'http://localhost:8080/api/graphql',
  documents: ['ui/src/graphql/**/*.ts'],
  verbose: true,
  generates: {
    'ui/src/graphql/__generated__/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
};

export default config;
