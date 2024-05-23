const { MDB_USERNAME, MDB_PW, MDB_NAME } = process.env;

const api_db = db.getSiblingDB(MDB_NAME); // eslint-disable-line no-undef

api_db.createUser({
  user: MDB_USERNAME,
  pwd: MDB_PW,
  roles: [
    {
      role: 'readWrite',
      db: MDB_NAME,
    },
  ],
});

// TODO populate some dev/test data
