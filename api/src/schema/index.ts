import { mergeSchemas } from '@graphql-tools/schema';

import { GraphQLSchema, GraphQLObjectType, GraphQLNonNull } from 'graphql';

import { GraphQLJSON } from 'graphql-type-json'; // JSON is outside of the standard GraphQL scalar types

import { RootSchema } from './core/RootSchema.ts';
import { UserSchema } from './core/user/UserSchema.ts';

// TODO: this is part of an older mockup of Safe Inputs, can be deleted eventually. Currently still used by the ui,
// as a placeholder for sheet upload functionality. Leaving in place for now
export const TemporaryExampleMutation = new GraphQLSchema({
  mutation: new GraphQLObjectType({
    // GraphQL ensures that variables match the types defined in the schema. This mutation acts as a filter;
    // allowing only valid JSON formated data through
    name: 'Mutation',
    fields: {
      verifyJsonFormat: {
        type: GraphQLJSON,
        args: {
          sheetData: { type: new GraphQLNonNull(GraphQLJSON) },
        },
        async resolve(_parent, { sheetData }, _info) {
          console.log(JSON.stringify(sheetData));
          return sheetData;
        },
      },
    },
  }),
});

export const schema = mergeSchemas({
  schemas: [RootSchema, UserSchema, TemporaryExampleMutation],
});
