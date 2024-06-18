import mongoose from 'mongoose';
import { get_env } from './env.js';

export const connect_db = async () => {
  const { MDB_CONNECT_STRING } = get_env();

  queueMicrotask(() => console.log('Attempting MongoDB connection...'));

  return await mongoose
    .connect(MDB_CONNECT_STRING, {
      serverSelectionTimeoutMS: 7500,
      heartbeatFrequencyMS: 10000,
    })
    .then(() => queueMicrotask(() => console.log('MongoDB connected!')));
};

export const get_db_client = () => mongoose.connection.getClient();

export const get_db_connection_status = () =>
  mongoose.connection.states[mongoose.connection.readyState];
