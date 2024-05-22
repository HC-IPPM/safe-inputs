const { MDB_USERNAME, MDB_PW, MDB_NAME } = process.env;

api_db = db.getSiblingDB(MDB_NAME);

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
