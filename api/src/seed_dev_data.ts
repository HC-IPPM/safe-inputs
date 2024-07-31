import dotenv from 'dotenv';

import { connect_db } from './db.ts';
import { get_env } from './env.ts';

import {
  create_collection,
  insert_records,
  update_collection_def_fields,
  update_collection_column_defs,
} from './schema/core/Collection/CollectionModel.ts';
import { get_or_create_users } from './schema/core/User/UserModel.ts';

dotenv.config({ path: '.env' }); // relative to the call point, e.g. the service root

const {
  DEV_IS_LOCAL_ENV,
  AUTHZ_EMAIL_HOSTS_ALLOWED,
  AUTHZ_EMAIL_HOSTS_ALLOWED_PRIVILEGES,
  AUTHZ_SUPER_ADMINS,
} = get_env();

if (!DEV_IS_LOCAL_ENV) {
  throw new Error('Do NOT use seed_dev_data.ts in prod!');
}

console.log('Connecting to DB...');
await connect_db();
console.log('   Done');

console.log('Creating users...');
await get_or_create_users(AUTHZ_SUPER_ADMINS);

const test_cases = ['group1', 'group2', 'both', 'empty'];

const [owner_1, owner_2, owner_both] = await get_or_create_users(
  test_cases.map(
    (code) => `owner-${code}@${AUTHZ_EMAIL_HOSTS_ALLOWED_PRIVILEGES[0]}`,
  ),
);

const [user_1, user_2, user_both] = await get_or_create_users(
  test_cases.map(
    (code) =>
      `user-${code}@${AUTHZ_EMAIL_HOSTS_ALLOWED === '*' ? 'test.com' : AUTHZ_EMAIL_HOSTS_ALLOWED[0]}`,
  ),
);
console.log('   Done');

console.log('Creating collections...');
const collection_1 = await create_collection(
  owner_1,
  {
    name_en: 'Group 1 Collection 1',
    name_fr: 'Group 1 Collection 1 FR',
    description_en: 'desc',
    description_fr: 'desc FR',
    owners: [owner_1._id, owner_both._id],
    uploaders: [user_1._id, user_both._id],
    is_locked: false,
  },
  [
    {
      header: 'column_1',
      name_en: 'Column 1',
      name_fr: 'Column 1 FR',
      description_en: 'Column 1 desc',
      description_fr: 'Column 1 desc FR',
      data_type: 'boolean',
      conditions: [],
    },
    {
      header: 'column_2',
      name_en: 'Column 2',
      name_fr: 'Column 2 FR',
      description_en: 'Column 2 desc',
      description_fr: 'Column 2 desc FR',
      data_type: 'boolean',
      conditions: [],
    },
  ],
);

await insert_records(
  collection_1,
  [
    { column_1: 1, column_2: 2 },
    { column_1: 3, column_2: 4 },
    { column_1: 5, column_2: 6 },
  ],
  owner_1,
);

await insert_records(
  collection_1,
  [
    { column_1: 7, column_2: 8 },
    { column_1: 9, column_2: 10 },
    { column_1: 11, column_2: 12 },
  ],
  user_1,
);

await create_collection(
  owner_1,
  {
    name_en: 'Group 1 Collection 2 (locked)',
    name_fr: 'Group 1 Collection 2 (locked) FR',
    description_en: 'desc (locked)',
    description_fr: 'desc FR (locked)',
    owners: [owner_1._id, owner_both._id],
    uploaders: [user_1._id, user_both._id],
    is_locked: true,
  },
  [],
);

const collection_2 = await create_collection(
  owner_2,
  {
    name_en: 'Group 2 Collection 1',
    name_fr: 'Group 2 Collection 1 FR',
    description_en: 'desc',
    description_fr: 'desc FR',
    owners: [owner_2._id, owner_both._id],
    uploaders: [user_2._id, user_both._id],
    is_locked: false,
  },
  [
    {
      header: 'column_1',
      name_en: 'Column 1',
      name_fr: 'Column 1 FR',
      description_en: 'Column 1 desc',
      description_fr: 'Column 1 desc FR',
      data_type: 'boolean',
      conditions: [],
    },
    {
      header: 'column_2',
      name_en: 'Column 2',
      name_fr: 'Column 2 FR',
      description_en: 'Column 2 desc',
      description_fr: 'Column 2 desc FR',
      data_type: 'boolean',
      conditions: [],
    },
  ],
);
const collection_2_new_minor_ver = await update_collection_def_fields(
  collection_2,
  owner_2,
  {
    name_en: 'Group 2 Collection 1',
    name_fr: 'Group 2 Collection 1 FR',
    description_en: 'desc v1,1',
    description_fr: 'desc FR v1.1',
    owners: [owner_2._id, owner_both._id],
    uploaders: [user_2._id, user_both._id],
    is_locked: false,
  },
);
await update_collection_column_defs(collection_2_new_minor_ver, owner_2, [
  {
    header: 'column_1',
    name_en: 'Column 1 v2',
    name_fr: 'Column 1 FR v2',
    description_en: 'Column 1 desc v2',
    description_fr: 'Column 1 desc FR v2',
    data_type: 'boolean',
    conditions: [],
  },
  {
    header: 'column_2',
    name_en: 'Column 2 v2',
    name_fr: 'Column 2 FR v2',
    description_en: 'Column 2 desc v2',
    description_fr: 'Column 2 desc FR v2',
    data_type: 'boolean',
    conditions: [],
  },
]);
console.log('   Done');
