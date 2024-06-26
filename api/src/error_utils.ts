export type AppErrorInstance = Error & { statusCode: number };

interface AppErrorConstructor {
  (statusCode: number, message: string): AppErrorInstance;
  new (statusCode: number, message: string): AppErrorInstance;
}

export const AppError = function (statusCode: number, message: string) {
  const error = new Error(message) as AppErrorInstance;

  error.statusCode = statusCode;

  return error;
} as AppErrorConstructor;
