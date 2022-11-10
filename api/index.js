import 'dotenv/config'
import { Server } from './src/Server.js'
import { schema } from './src/schema.js'
import { connect, JSONCodec, credsAuthenticator, jwtAuthenticator } from 'nats'
// import { readFile } from 'node:fs/promises';

const {
  PORT = 3000,
  HOST = '0.0.0.0',
  // NATS_URL = "demo.nats.io:4222", // Uncomment this to use demo server
  NATS_URL = "tls://connect.ngs.global:4222", // Comment this out to use demo server
} = process.env;

// const creds = await readFile("./nats.creds", { encoding: 'utf8' });  // Comment this out to use demo server
const jwt = process.env.NATS_JWT // Comment this out to use demo server

var enc = new TextEncoder(); // always utf-8

const nc = await connect({ 
  servers: NATS_URL,
  authenticator: jwtAuthenticator(jwt), // Comment this out to use demo server
  // authenticator: credsAuthenticator(enc.encode(creds)), // Comment this out to use demo server
})

const jc = JSONCodec();

function publish(payload) {
  // Publishes payload of json valid spreadsheet data via NATS. Called in GraphQL resolver.
  nc.publish("sheetData", jc.encode(payload))
  // console.log (JSON.stringify(payload))
}

process.on('SIGTERM', () => process.exit(0))
process.on('SIGINT', () => process.exit(0))
;(async () => {
  const server = new Server({
    schema,
    context: { publish },
  })
  server.listen({ port: PORT, host: HOST }, () =>
    console.log(`🚀 Safe-inputs API listening on ${HOST}:${PORT}`),
  )
})()
