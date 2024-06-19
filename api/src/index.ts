import dotenv from 'dotenv';

import { create_app } from './create_app.ts';
import { get_env } from './env.ts';
import { schema } from './schema.ts';

dotenv.config({ path: '.env' }); // relative to the call point, e.g. the service root

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
