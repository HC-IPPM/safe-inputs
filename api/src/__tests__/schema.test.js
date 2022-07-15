// eslint-disable-next-line
import { jest } from '@jest/globals' // support for ESM modules
import { schema } from '../schema.js'
import { graphql } from 'graphql'

describe('schema', () => {
  describe('query', () => {
    describe('hello', () => {
      it('includes a hello world field for testing', async () => {
        const response = await graphql({
          schema,
          source: '{hello}',
        })

        expect(response).toEqual({ data: { hello: 'world!' } })
      })
    })
  })
})
