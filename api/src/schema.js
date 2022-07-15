import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      hello: {
        type: GraphQLString,
        resolve(_parent, _args, _context, _info) {
          return 'world!'
        },
      },
    }),
  }),
})
