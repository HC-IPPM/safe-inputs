import 'dotenv/config'
import { Server } from './src/Server.js'
import { schema } from './src/schema.js'
import { connect, JSONCodec } from 'nats'

const {
  PORT = 3000,
  HOST = '0.0.0.0',
  NATS_URL = "demo.nats.io:4222" ,
} = process.env


const nc = await connect({ servers: NATS_URL })
const jc = JSONCodec();

// Also see this  from https://github.com/canada-ca/tracker/blob/master/scanners/domain-dispatcher/index.js
// function publish() {return('test publish')} // Placeholder to be replaced with NATS

function publish(payload) {
  // Publishes payload of json valid spreadsheet data (ie sheetData). Called in GraphQL resolver.
  // TODO add in metadata 
  nc.publish("sheetData", jc.encode(payload))
  console.log (payload)
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
