import { createServer } from 'http';

import { maxAliasesPlugin } from '@escape.tech/graphql-armor-max-aliases';
import { maxDepthPlugin } from '@escape.tech/graphql-armor-max-depth';
import { createYoga } from '@graphql-yoga/node';

import { connect_db } from './db_utils.js';

export function Server({ schema, context = {} }) {
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

  // reassert the DB connection before attempting to handle a request. An existing
  // DB connection will be reused
  const server = createServer((request, response) =>
    connect_db().then(yoga(request, response)),
  );

  return server;
}
