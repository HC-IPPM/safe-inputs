import { makeExecutableSchema } from '@graphql-tools/schema';

import { LangsUnion } from 'src/schema/lang_utils.ts';

export const RootSchema = makeExecutableSchema({
  typeDefs: `
  type Query {
    root(lang:String): Root!
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
        { lang }: { lang?: LangsUnion },
        context: any,
      ) => {
        // TODO: if lang arg not provided or invalid, fall back to context.req.acceptsLanguage(). If no accepted language is supported, throw something?
        context.lang = lang;
        return {};
      },
    },
  },
});
