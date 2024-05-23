import { maxAliasesPlugin } from '@escape.tech/graphql-armor-max-aliases';
import { maxDepthPlugin } from '@escape.tech/graphql-armor-max-depth';
import { createYoga } from '@graphql-yoga/node';
import express from 'express';

import { connect_db } from './db_utils.js';

// priming the DB connection asynchronously on module load, ok if this fails,
// will reassert connection before handling any given request
connect_db().catch((err) => {
  console.error(err);
});

export function App({ schema, context = {} }) {
  const app = express();

  // reassert the DB connection before attempting to handle a request. An existing DB connection will be reused
  app.use((_req, _res, next) => connect_db().then(() => next()));

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
