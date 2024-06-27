import type { Request, Response, NextFunction } from 'express';

export type AppErrorInstance = Error & { status: number };

interface AppErrorConstructor {
  (status: number, message: string): AppErrorInstance;
  new (status: number, message: string): AppErrorInstance;
}

export const AppError = function (status: number, message: string) {
  const error = new Error(message) as AppErrorInstance;

  // standard in express.js to add an HTTP status code on errors, as `status`, to be used by error handling middleware/error responses
  // both when throwing errors and when passing them to an express `next` call
  error.status = status;

  return error;
} as AppErrorConstructor;

export const errorHandler = (
  err: Error | AppErrorInstance,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(err.stack); // TODO: a good structured logging library and logging utils are a TODO

  const status_code = 'status' in err ? err.status : 500;

  res.status(status_code).json({ error: err.message });
};
