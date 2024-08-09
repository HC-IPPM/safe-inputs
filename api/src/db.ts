import mongoose, { ClientSession } from 'mongoose';

import { get_env } from './env.ts';

export const connect_db = async () => {
  const { MDB_CONNECT_STRING } = get_env();

  queueMicrotask(() => console.log('Attempting MongoDB connection...'));

  // necessary for `connection.transaction(...)` https://mongoosejs.com/docs/transactions.html#asynclocalstorage
  mongoose.set('transactionAsyncLocalStorage', true);

  return await mongoose
    .connect(MDB_CONNECT_STRING, {
      serverSelectionTimeoutMS: 7500,
      heartbeatFrequencyMS: 10000,
    })
    .then(() => queueMicrotask(() => console.log('MongoDB connected!')));
};

export const get_db_client = () => mongoose.connection.getClient();

// Mongo transactions require a replica set. The docker compose dev env does not currently
// use a replica set, so transactions are disabled (by passing an undefined `session`) in dev
export const db_transaction: typeof mongoose.connection.transaction = (
  fn,
  options,
) =>
  !get_env().DEV_IS_LOCAL_ENV
    ? mongoose.connection.transaction(fn, options)
    : fn(undefined as unknown as ClientSession);
