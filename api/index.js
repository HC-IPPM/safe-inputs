import 'dotenv/config';
import { connect, JSONCodec, jwtAuthenticator } from 'nats'; // eslint-disable-line no-unused-vars

import { schema } from './src/schema.js';
import { Server } from './src/Server.js';

const {
  PORT = 3000,
  HOST = '0.0.0.0',
  NATS_URL = 'demo.nats.io:4222', // Uncomment this to use demo server
  // NATS_URL = "tls://connect.ngs.global:4222", // Comment this out to use demo server
} = process.env;

// For NATS ngs server connection
// const jwt = process.env.NATS_JWT // Comment this out to use demo server

const nc = await connect({
  servers: NATS_URL,
  // authenticator: jwtAuthenticator(jwt), // Comment this out to use demo server
});

const jc = JSONCodec(); // for encoding NAT's messages

// ---- Setup Jetstream
const jsm = await nc.jetstreamManager();
const js = nc.jetstream();

// Add a stream to publish on
const stream = 'safeInputsRawSheetData';
const subj = `safeInputsRawSheetData`;
await jsm.streams.add({ name: stream, subjects: [subj] });

function publish(payload) {
  js.publish(`safeInputsRawSheetData`, jc.encode(payload));
}

process.on('SIGTERM', () => {
  throw new Error('SIGTERM');
});
process.on('SIGINT', () => {
  throw new Error('SIGINT');
});
(async () => {
  const server = new Server({
    schema,
    context: { publish },
  });
  server.listen({ port: PORT, host: HOST }, () =>
    console.log(`🚀 Safe-inputs API listening on ${HOST}:${PORT}`),
  );
})();
