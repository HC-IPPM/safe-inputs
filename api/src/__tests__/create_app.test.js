import { makeExecutableSchema } from '@graphql-tools/schema';
import mongoose from 'mongoose';
import request from 'supertest'; // eslint-disable-line node/no-unpublished-import

import { create_app } from '../create_app.js';

import { get_api_route } from '../route_utils.js';

// ----- TEST SET UP -----

// Construct a schema, using GraphQL schema language
const typeDefs = /* GraphQL */ `
  scalar JSON

  type Query {
    hello: String
  }

  type Mutation {
    verifyJsonFormat(sheetData: JSON!): JSON
  }
`;
const resolvers = {
  Query: {
    hello: () => {
      return 'world!';
    },
  },
  Mutation: {
    verifyJsonFormat(_parent, { sheetData }, _info) {
      return sheetData;
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

// ----- TESTS -----

describe('create_app', () => {
  afterEach(() => {
    // necessary cleanup to prevent Jest from being held open by a dangling DB handler
    return mongoose.connection.close();
  });

  describe('given a schema and resolver', () => {
    it('returns an express app', async () => {
      const app = await create_app({ schema });

      const response = await request(app)
        .post(get_api_route('graphql'))
        .set('Accept', 'application/json')
        .send({
          query: '{hello}',
        });

      expect(response.body).toEqual({ data: { hello: 'world!' } });
    });
  });

  describe('given an overly complex query', () => {
    it('rejects it', async () => {
      const app = await create_app({ schema });

      const response = await request(app)
        .post(get_api_route('graphql'))
        .set('Accept', 'application/json')
        .send({
          query:
            '{a:hello, b:hello, c:hello, d:hello, e:hello, f:hello, g:hello, h:hello}',
        });
      const [err] = response.body.errors;

      expect(err.message).toMatch(
        'Syntax Error: Aliases limit of 4 exceeded, found 8',
      );
    });
  });

  describe('given a simple query', () => {
    it('executes it', async () => {
      const app = await create_app({ schema });

      const response = await request(app)
        .post(get_api_route('graphql'))
        .set('Accept', 'application/json')
        .send({
          query: '{hello}',
        });

      expect(response.body).not.toHaveProperty('errors');
    });
  });

  describe('given a mutation query', () => {
    it('executes it', async () => {
      const app = await create_app({ schema });

      const response = await request(app)
        .post(get_api_route('graphql'))
        .set('Accept', 'application/json')
        .send({
          query: `mutation {
                verifyJsonFormat(sheetData: "a")
             }`,
        });

      expect(response.body).not.toHaveProperty('errors');
    });
  });
});
