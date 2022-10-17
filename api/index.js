import 'dotenv/config'
import { Server } from './src/Server.js'
import { schema } from './src/schema.js'

const {
  PORT = 3000,
  HOST = '0.0.0.0',
} = process.env

function publish() {return('test publish')} // Placeholder to be replaced with NATS

function publish() {return('test publish')} // Placeholder to be replaced with NATS

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
