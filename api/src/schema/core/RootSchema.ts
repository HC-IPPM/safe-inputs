import { makeExecutableSchema } from '@graphql-tools/schema';

import { LangsUnion } from 'src/schema/lang_utils.ts';

export const RootSchema = makeExecutableSchema({
  typeDefs: `
  type Query {
    query_root(lang:String): QueryRoot!
  }

  type QueryRoot {
    # graphQL cant have empty blocks of fields, this is a placeholder. Other schema definitions extend QueryRoot with their own search fields etc
    # TODO any better way to do this? Or maybe there's some meaningful values to stick on the query query_root (release version?)
    non_field: String,
  }
`,
  resolvers: {
    Query: {
      query_root: (
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
