import 'dotenv/config';

import { create_app } from './src/create_app.js';

import { schema } from './src/schema.js';

const { PORT = 3000, HOST = '0.0.0.0' } = process.env;

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

app.listen({ port: PORT, host: HOST }, () =>
  console.log(`🚀 Safe-inputs API listening on ${HOST}:${PORT}`),
);
