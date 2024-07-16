import { makeExecutableSchema } from '@graphql-tools/schema';

import { validate_user_is_super_user } from 'src/authz.ts';
import { AppError, app_error_to_gql_error } from 'src/error_utils.ts';

import { UserByEmailLoader } from 'src/schema/core/User/UserModel.ts';
import { with_authz } from 'src/schema/resolver_utils.ts';

import {
  CollectionModel,
  CollectionByIdLoader,
  CurrentCollectionsByOwnersLoader,
  CurrentCollectionsByUploadersLoader,
  create_new_collection,
  update_collection,
  user_is_owner_of_collection,
  user_is_uploader_for_collection,
} from './CollectionModel.ts';

import {
  RecordsetModel,
  RecordsetByIdLoader,
  are_new_column_defs_compatible_with_current_recordset,
  update_column_defs_on_recordset,
  validate_new_records_against_recordset,
  insert_record_in_recordset,
  delete_record_in_recordset,
} from './RecordsetModel.ts';

export const CollectionSchema = makeExecutableSchema({
  typeDefs: `
  type Root {
    user_owned_collections(email: String!): [Collection]
    user_uploadable_collections(email: String!): [Collection]
    collections: [Collection]
  }

  type User {
    owned_collections: [Collection]
    uploadable_collections: [Collection]
  }
  
  type Collection {
    TODO: String
  }

  type Recordset {
    TODO: String
  }

  type ColumnDef {
    TODO: String
  }

  type Record {
    TODO: String
  }
`,
  resolvers: {
    Root: {
      user_owned_collections: with_authz(
        async (
          _parent: unknown,
          { email }: { email: string },
          _context: unknown,
          _info: unknown,
        ) => {
          const user = await UserByEmailLoader.load(email);
          return typeof user === 'undefined'
            ? []
            : CurrentCollectionsByOwnersLoader.load(user._id.toString());
        },
        validate_user_is_super_user,
      ),
      user_uploadable_collections: with_authz(
        async (
          _parent: unknown,
          { email }: { email: string },
          _context: unknown,
          _info: unknown,
        ) => {
          const user = await UserByEmailLoader.load(email);
          return typeof user === 'undefined'
            ? []
            : CurrentCollectionsByUploadersLoader.load(user._id.toString());
        },
        validate_user_is_super_user,
      ),
      collections: with_authz(
        () => CollectionModel.find({ is_current: true }),
        validate_user_is_super_user,
      ),
    },
    User: {},
    Collection: {},
    Recordset: {},
    ColumnDef: {},
    Record: {},
  },
});
