import mongoose from 'mongoose';
import { get_env } from './env_utils.js';

export async function connect_db() {
  const { MDB_CONNECT_STRING } = get_env();

  queueMicrotask(() => console.log('Attempting MongoDB connection...'));

  return await mongoose
    .connect(MDB_CONNECT_STRING, {
      serverSelectionTimeoutMS: 7500,
      heartbeatFrequencyMS: 10000,
    })
    .then(() => queueMicrotask(() => console.log('MongoDB connected!')));
}

export function get_db_client() {
  return mongoose.connection.getClient();
}

export function get_db_connection_status() {
  return mongoose.connection.states[mongoose.connection.readyState];
}
