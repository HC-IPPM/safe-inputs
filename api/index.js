import 'dotenv/config'
import postgres from 'postgres'
import { Server } from './src/Server.js'
import { schema } from './src/schema.js'

const {
  PORT = 3000,
  HOST = '0.0.0.0',
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_PASS,
  DB_USER,
} = process.env

const sql = postgres({
  host: DB_HOST,
  port: 5432,
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASS,
})

function publish() {return('test publish')} // Placeholder to be replaced with NATS

process.on('SIGTERM', () => process.exit(0))
process.on('SIGINT', () => process.exit(0))
;(async () => {
  const server = new Server({
    schema,
    context: { sql, publish },
  })
  server.listen({ port: PORT, host: HOST }, () =>
    console.log(`🚀 Safe-inputs API listening on ${HOST}:${PORT}`),
  )
})()
