import type { Request, Response, NextFunction } from 'express';

import { GraphQLError } from 'graphql';

import { get_env } from './env.ts';

export class AppError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const handle_error_logging = (err: Error | AppError) => {
  const { DEV_IS_TEST_ENV } = get_env();

  if (!DEV_IS_TEST_ENV) {
    // TODO: a good structured logging library and logging utils are a TODO
    // console output should be silenced when running tests, for clean test reports
    console.error(err.stack);
  }
};

const get_status_code = (err: Error | AppError) =>
  'status' in err ? err.status : 500;

export const expressErrorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  handle_error_logging(err);

  res.status(get_status_code(err)).json({ error: err.message });
};

// Seems this should be more strongly typeable with a conditional return type, but the typechecker wasn't happy with anything I tried in that direction,
// possibly because AppError inherits from Error and makes the type narrowing obtuse?
export const app_error_to_gql_error = (
  err: Error | AppError,
): Error | GraphQLError => {
  // yoga catches errors thrown while resloving GQL requests. These errors don't reach the express error handler, instead yoga
  // processes them and includes them in the `errors` field of the GQL response, as is expected for GraphQL. Yoga only includes messages
  // from GraphQLError instances in the client response, but we want AppError thrown by our common utils to be reported to the client too
  // See here for more on why: https://the-guild.dev/graphql/yoga-server/tutorial/basic/09-error-handling#exposing-safe-error-messages

  if (err instanceof AppError) {
    return new GraphQLError(err.message, {
      extensions: {
        code: get_status_code(err),
      },
    });
  } else {
    return err;
  }
};
