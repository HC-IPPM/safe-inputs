import { AppError } from 'src/error_utils.ts';

describe('AppError', () => {
  it('constructs a new error with the provided message and the additional status property', () => {
    const message = 'test message for testing the message';
    const status = 123;

    const appError = new AppError(status, message);

    expect(appError).toBeInstanceOf(Error);
    expect(appError.message).toBe(message);
    expect(appError.status).toBe(status);
  });
});
