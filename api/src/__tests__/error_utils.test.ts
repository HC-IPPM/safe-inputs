import { AppError } from 'src/error_utils.ts';

describe('AppError', () => {
  it('constructs a new error with the provided message and the additional statusCode property', () => {
    const message = 'test message for testing the message';
    const statusCode = 123;

    const appError = new AppError(statusCode, message);

    expect(appError).toBeInstanceOf(Error);
    expect(appError.message).toBe(message);
    expect(appError.statusCode).toBe(statusCode);
  });
});
