import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // TODO this is just for the docker env
  schema: 'http://api:3000/api/graphql', // eslint-disable-line
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
