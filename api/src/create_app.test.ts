import { makeExecutableSchema } from '@graphql-tools/schema';
import mongoose from 'mongoose';

import request from 'supertest';

import { create_app } from './create_app.ts';

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
    verifyJsonFormat(
      _parent: unknown,
      { sheetData }: { sheetData: JSON },
      _info: unknown,
    ) {
      return sheetData;
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

describe('create_app', () => {
  const ORIGINAL_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    // Need to disable CSRF protection middleware during these tests
    process.env = {
      ...ORIGINAL_ENV,
      DEV_FORCE_DISABLE_CSRF_PROTECTION: 'true',
    };
  });
  afterEach(() => {
    process.env = ORIGINAL_ENV;

    // necessary cleanup to prevent Jest from being held open by a dangling DB handler
    return mongoose.connection.close();
  });

  describe('given a schema and resolver', () => {
    it('returns an express app with the corresponding graphql endpoint', async () => {
      const app = await create_app({
        schema,
      });

      const response = await request(app)
        .post('/api/graphql')
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
        .post('/api/graphql')
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
        .post('/api/graphql')
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
        .post('/api/graphql')
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
