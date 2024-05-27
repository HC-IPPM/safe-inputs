import { ExpressAuth } from '@auth/express';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { maxAliasesPlugin } from '@escape.tech/graphql-armor-max-aliases';
import { maxDepthPlugin } from '@escape.tech/graphql-armor-max-depth';
import { createYoga } from '@graphql-yoga/node';
import express from 'express';

import {
  sendVerificationRequestGCNotify,
  sendVerificationRequestConsole,
} from './auth_utils.js';
import { connect_db, get_db_connection } from './db_utils.js';

const {
  IS_LOCAL_ENV = false,
  FORCE_ENABLE_GCNOTIFY = false,
  MAX_SESSION_AGE = 24 * 60 * 60,
  IS_TEST_ENV = false,
} = process.env;

if (!IS_TEST_ENV) {
  // priming the DB connection asynchronously on module load, ok if this fails,
  // will reassert connection before handling any given request.
  // Skip when running tests as leaving a potentially unresolved promise like this
  // is something Jest will complain about. To be clear, it's good that Jest will
  // notice that for us when it's due to an actual mistake, but we don't want this
  // intentional prod optimization being a flase positive to Jest.
  connect_db().catch((err) => {
    console.error(err);
  });
}

export function App({ schema, context = {} }) {
  const app = express();

  // reassert mongodb connection before trying to handle any requests
  app.use((_req, _res, next) => connect_db().then(() => next()));

  app.set('trust proxy', true); // auth.js needs to be able to read the `X-Forwarded-*` header, if/when behind a proxy
  app.use(
    '/auth/*',
    ExpressAuth({
      providers: [
        {
          id: 'gcnotify',
          type: 'email',
          maxAge: MAX_SESSION_AGE,
          sendVerificationRequest:
            IS_LOCAL_ENV && !FORCE_ENABLE_GCNOTIFY
              ? sendVerificationRequestConsole
              : sendVerificationRequestGCNotify,
        },
      ],
      adapter: MongoDBAdapter(get_db_connection().connect()),
      debug: IS_LOCAL_ENV,
    }),
  );

  const yoga = createYoga({
    schema,
    context,
    plugins: [
      // Explore https://the-guild.dev/graphql/envelop/plugins for more The Guild pluggins
      maxAliasesPlugin({ n: 4 }), // default 15
      maxDepthPlugin({ n: 6 }), // Number of depth allowed | Default: 6
    ],
    graphqlEndpoint: '/graphql',
  });

  app.use(yoga.graphqlEndpoint, yoga);

  return app;
}
