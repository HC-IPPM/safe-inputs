import mongoose from 'mongoose';

export async function connect_db() {
  queueMicrotask(() => console.log('Attempting MongoDB connection...'));

  return await mongoose
    .connect(process.env.MDB_CONNECT_STRING, {
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
