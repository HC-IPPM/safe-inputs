import { graphql } from 'graphql';

import { schema } from './index.ts';

describe('schema', () => {
  describe('mutation', () => {
    describe('verifyJsonFormat with object input', () => {
      it('will accept JSON object for SheetData field', async () => {
        const response = await graphql({
          schema,
          source: `mutation verifyJsonFormat($testObject: JSON!){
            verifyJsonFormat(sheetData: $testObject)}`,
          variableValues: { testObject: { name: 'John', age: 30, car: null } },
        });

        expect(typeof response.data?.verifyJsonFormat === 'object').toBe(true);
      });
    });

    describe('verifyJsonFormat with string input', () => {
      it('will accept JSON string for SheetData field', async () => {
        const response = await graphql({
          schema,
          // source: 'mutation {verifyJsonFormat(sheetData: "a")}',
          source: `mutation verifyJsonFormat($testString: JSON!){
            verifyJsonFormat(sheetData: $testString)}`,
          variableValues: { testString: 'a' },
          contextValue: { publish: () => 'this is a string' },
        });

        expect(response).toEqual({ data: { verifyJsonFormat: 'a' } });
        expect(typeof response.data?.verifyJsonFormat === 'string').toBe(true);
      });
    });

    describe('verifyJsonFormat with non JSON input', () => {
      it('will result in an error', async () => {
        const response = await graphql({
          schema,
          source: 'mutation {verifyJsonFormat(sheetData: a)}',
        });
        const [err] = response.errors || [];

        expect(err.message).toEqual(
          'Expected value of type "JSON!", found a; JSON cannot represent value: a',
        );
      });
    });

    describe('verifyJsonFormat with null input', () => {
      it('will result in error', async () => {
        const response = await graphql({
          schema,
          source: 'mutation {verifyJsonFormat(sheetData: }',
        });
        const [err] = response.errors || [];

        expect(err.message).toEqual('Syntax Error: Unexpected "}".');
      });
    });
  });
});
