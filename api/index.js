import 'dotenv/config';

import { connect_db } from './src/db_utils.js';
import { schema } from './src/schema.js';
import { Server } from './src/Server.js';

const { PORT = 3000, HOST = '0.0.0.0' } = process.env;

process.on('SIGTERM', () => {
  throw new Error('SIGTERM');
});

process.on('SIGINT', () => {
  throw new Error('SIGINT');
});

(async () => {
  const server = new Server({
    schema,
    context: {},
  });

  // priming the DB connection, ok if this fails, will reassert connection before handling
  // any given request
  connect_db().catch((err) => {
    console.error(err);
  });

  server.listen({ port: PORT, host: HOST }, () =>
    console.log(`🚀 Safe-inputs API listening on ${HOST}:${PORT}`),
  );
})();
