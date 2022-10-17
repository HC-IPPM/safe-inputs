import request from 'supertest'
import { Server } from '../Server.js'
import { jest } from '@jest/globals' // support for ESM modules
import { makeExecutableSchema } from '@graphql-tools/schema'

// Construct a schema, using GraphQL schema language
const typeDefs = /* GraphQL */ `
  scalar JSON

  type Query {
    hello: String
  }

  type Mutation {
    verifyJsonFormat(sheetData: JSON!):JSON
}
`
const resolvers = {
  Query:{
    hello: () => {
      return 'world!'
    },
  },
  Mutation:{
    verifyJsonFormat(_parent, { sheetData }, {publish}, _info) {
      const testContext = console.log(publish()) // This will be replaced with NATS publish function 
      return sheetData
   }, 
  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

describe('Server', () => {
  describe('given a schema and resolver', () => {
    it('returns an express server', async () => {
      const server = new Server({ schema})

      const response = await request(server)
        .post('/')
        .set('Accept', 'application/json')
        .send({
          query: '{hello}',
        })

      expect(response.body).toEqual({ data: { hello: 'world!' } })
    })
  })

  describe('given an overly complex query', () => {
    it('rejects it', async () => {
      const server = new Server({ schema })
      const response = await request(server)
        .post('/')
        .set('Accept', 'application/json')
        .send({
          query: '{a:hello, b:hello, c:hello, d:hello, e:hello, f:hello, g:hello, h:hello}',
        })
      const [err] = response.body.errors

      expect(err.message).toMatch(/^Syntax Error: Query Cost limit of 10 exceeded/);
    })
  })

  describe('given a simple query', () => {
    it('executes it', async () => {
      const server = new Server({ schema })
      const response = await request(server)
        .post('/')
        .set('Accept', 'application/json')
        .send({
          query: '{hello}',
        })

      expect(response.body).not.toHaveProperty('errors')
    })
  })

  describe('given a mutation query', () => {
    it('calls the context', async () => {
      const publish = jest.fn()
      const server = new Server({ schema, context:{publish}})
      
      const response = await request(server)
        .post('/')
        .set('Accept', 'application/json')
        .send({
          query: `mutation {
                verifyJsonFormat(sheetData: "a")
             }`,
          contextValue: {publish},
        })

      expect(response.body).not.toHaveProperty('errors')
      expect(publish).toHaveBeenCalledTimes(1)
    })
  })
})
