export type AppErrorInstance = Error & { status: number };

interface AppErrorConstructor {
  (status: number, message: string): AppErrorInstance;
  new (status: number, message: string): AppErrorInstance;
}

export const AppError = function (status: number, message: string) {
  const error = new Error(message) as AppErrorInstance;

  error.status = status;

  return error;
} as AppErrorConstructor;
