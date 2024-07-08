import { makeExecutableSchema } from '@graphql-tools/schema';

import { LangsUnion } from 'src/schema/lang_utils.ts';

export const RootSchema = makeExecutableSchema({
  typeDefs: `
  type Query {
    root(lang:String!): Root!
  }

  type Root {
    # graphQL cant have empty blocks of fields, this is a placeholder. Other schema definitions extend Root with their own search fields etc
    non_field: String,
  }
`,
  resolvers: {
    Query: {
      root: (
        _parent: unknown,
        { lang }: { lang: LangsUnion },
        context: any,
      ) => {
        context.lang = lang;
        return {};
      },
    },
  },
});
