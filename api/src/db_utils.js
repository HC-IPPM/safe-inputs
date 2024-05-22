import mongoose from 'mongoose';

function get_connection_str() {
  const { MDB_CONNECT_STRING, MDB_USERNAME, MDB_PW, MDB_NAME } = process.env;

  return MDB_CONNECT_STRING.replace('{MDB_USERNAME}', MDB_USERNAME)
    .replace('{MDB_PW}', MDB_PW)
    .replace('{MDB_NAME}', MDB_NAME);
}

// Connect to MongoDB with Mongoose. Note that this is async, but generally doesn't need to be awaited when called.
// It's safe to let the connection happen fully async because further mongoose opperations are also async and will
// buffer until the connection's made
export async function connect_db() {
  // TODO: temporary conditional! the kubernetes environment isn't ready for the api to attempt DB connections,
  // and tests need to be updated to, most likely, mock away DB connections
  if (process.env.IS_DEV_ENV && !process.env.IS_TEST_ENV) {
    console.log('Attempting MongoDB connection...');
    return await mongoose
      .connect(get_connection_str(), {
        serverSelectionTimeoutMS: 7500,
        heartbeatFrequencyMS: 10000,
      })
      .then(() => console.log('MongoDB connected!'));
  }
}

export function get_db_connection_status() {
  return mongoose.connection.states[mongoose.connection.readyState];
}
