import 'dotenv/config';

import { create_app } from './src/create_app.js';
import { get_env } from './src/env.js';
import { schema } from './src/schema.js';

const { HOST, PORT } = get_env();

process.on('SIGTERM', () => {
  throw new Error('SIGTERM');
});
process.on('SIGINT', () => {
  throw new Error('SIGINT');
});

const app = await create_app({
  schema,
  context: {},
});

app.listen({ host: HOST, port: PORT }, () =>
  console.log(`🚀 Safe-inputs API listening on ${HOST}:${PORT}`),
);
