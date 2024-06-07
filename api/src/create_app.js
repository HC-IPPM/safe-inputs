import { ExpressAuth } from '@auth/express';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { maxAliasesPlugin } from '@escape.tech/graphql-armor-max-aliases';
import { maxDepthPlugin } from '@escape.tech/graphql-armor-max-depth';
import { createYoga } from '@graphql-yoga/node';
import express from 'express';

import {
  sendVerificationRequestGCNotify,
  sendVerificationRequestConsole,
  redirectWithFix,
} from './auth_utils.js';
import { connect_db, get_db_client } from './db_utils.js';
import { get_api_route } from './route_utils.js';

const {
  IS_LOCAL_ENV = false,
  FORCE_ENABLE_GCNOTIFY = false,
  MAX_SESSION_AGE = 24 * 60 * 60,
} = process.env;

export const create_app = async ({ schema, context = {} }) => {
  await connect_db();

  const app = express();

  app.set('trust proxy', true); // auth.js needs to be able to read the `X-Forwarded-*` header, if/when behind a reverse proxy
  app.use(
    get_api_route('auth/*'),
    ExpressAuth({
      trustHost: true, // needs to be true if/when behind a reverse proxy https://authjs.dev/getting-started/deployment#auth_trust_host
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
      callbacks: {
        redirect: redirectWithFix,
      },
      adapter: MongoDBAdapter(get_db_client().connect()),
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
    graphqlEndpoint: get_api_route('graphql'),
  });

  app.use(yoga.graphqlEndpoint, yoga);

  return app;
};
