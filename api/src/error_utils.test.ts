import express from 'express';
import { GraphQLError } from 'graphql';
import request from 'supertest';

import {
  AppError,
  expressErrorHandler,
  app_error_to_gql_error,
} from './error_utils.ts';

describe('AppError', () => {
  it('constructs a new error with the provided message and the additional status property', () => {
    const message = 'test message for testing the message';
    const status = 123;

    const appError = new AppError(status, message);

    expect(appError).toBeInstanceOf(Error);
    expect(appError).toBeInstanceOf(AppError);
    expect(appError.message).toBe(message);
    expect(appError.status).toBe(status);
  });
});

describe('expressErrorHandler middlewear', () => {
  it('handles errors passed to next() by express routes', async () => {
    const app = express();

    const status_code = 500;

    app.get('/error-via-next', function (_req, _res, next) {
      next(new AppError(status_code, 'error'));
    });

    const mockedErrorHandler = jest.fn(expressErrorHandler);
    app.use(mockedErrorHandler);

    const response = await request(app)
      .get('/error-via-next')
      .set('Accept', 'application/json');

    expect(mockedErrorHandler).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(status_code);
  });

  it('handles errors thrown by express routes', async () => {
    const app = express();

    const status_code = 500;

    app.get('/error-via-next', function (_req, _res, _next) {
      throw new AppError(status_code, 'error');
    });

    const mockedErrorHandler = jest.fn(expressErrorHandler);
    app.use(mockedErrorHandler);

    const response = await request(app)
      .get('/error-via-next')
      .set('Accept', 'application/json');

    expect(mockedErrorHandler).toHaveBeenCalled();
    expect(response.status).toBe(status_code);
  });

  it('sets the response status based on the error, includes the error message in the response body', async () => {
    const app = express();

    const status_code = 418;
    const error_message = "I'm a teapot";

    app.get('/error', function (_req, _res, _next) {
      throw new AppError(status_code, error_message);
    });

    const mockedErrorHandler = jest.fn(expressErrorHandler);
    app.use(mockedErrorHandler);

    const response = await request(app)
      .get('/error')
      .set('Accept', 'application/json');

    expect(mockedErrorHandler).toHaveBeenCalled();
    expect(response.status).toBe(status_code);
    expect(response.body.error).toBe(error_message);
  });
});

describe('app_error_to_gql_error', () => {
  it('Returns non-AppError unmodified', () => {
    const err = new Error('something');

    expect(app_error_to_gql_error(err)).toBe(err);
  });
  it('Converts AppError instance to GraphQLError', () => {
    const err = new AppError(501, 'something');

    const returned_err = app_error_to_gql_error(err);

    expect(returned_err).not.toBe(err);
    expect(returned_err instanceof GraphQLError).toBe(true);
    expect((returned_err as GraphQLError).extensions.code).toBe(err.status); // `as GraphQLError` asserted by `instanceof GraphQLError` check above
    expect(returned_err.message).toBe(err.message);
  });
});
