import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import { GraphQLJSON } from 'graphql-type-json';

export const schema = new GraphQLSchema({

  query: new GraphQLObjectType({
    // Used for testing purposes at this time.
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

  mutation: new GraphQLObjectType({
    // GraphQL ensures that variables match the types defined in the schema. This mutation acts as a filter;  
    // allowing only valid JSON formated data through. (And if valid will be publish via nats.)
    name: 'Mutation',
    fields: { 
      verifyJsonFormat: {
        type: GraphQLJSON,
        args: {
          sheetData: { type: new GraphQLNonNull(GraphQLJSON) },
          },
        async resolve(_parent, { sheetData }, { publish }, _info) {
          publish(sheetData); 
          return sheetData;
        },
      },
    },
  }),
})
