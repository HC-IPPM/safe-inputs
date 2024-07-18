import { makeExecutableSchema } from '@graphql-tools/schema';

import { JSONResolver } from 'graphql-scalars';

import { validate_user_is_super_user } from 'src/authz.ts';

import {
  UserByEmailLoader,
  UserByIdLoader,
} from 'src/schema/core/User/UserModel.ts';
import type { UserDocument } from 'src/schema/core/User/UserModel.ts';
import {
  with_authz,
  resolve_lang_suffixed_scalar,
} from 'src/schema/resolver_utils.ts';

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
import type { CollectionDocument } from './CollectionModel.ts';

import {
  RecordsetByIdLoader,
  are_new_column_defs_compatible_with_current_recordset,
  update_column_defs_on_recordset,
  validate_new_records_against_recordset,
  insert_record_in_recordset,
  delete_record_in_recordset,
} from './RecordsetModel.ts';
import type { RecordInterface } from './RecordsetModel.ts';

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
    ### Scalar fields
    stable_key: String!
    name_en: String!
    name_fr: String!
    description_en: String!
    description_fr: String!
    sem_ver: String!
    is_current: Boolean!
    created_by: User!
    created_at: Float!
    is_locked: Boolean!
    
    ### Lang aware resolver scalar fields
    name: String!
    description: String!
    
    ### Non-scalar fields
    previous_version: Collection
    
    """
      \`owners\` array will be non-empty
    """
    owners: [User!]! # note: these !'s mean neither the field itself nor elements of the array may be null, but it doesn't enforce that the array is non-empty

    """
      \`uploaders\` array may be empty
    """
    uploaders: [User!]! # note: these !'s mean neither the field itself nor elements of the array may be null, but it doesn't enforce that the array is non-empty

    # the mongoose models have a \`Recordset\` layer between \`Collection\`s and \`ColumnDef\`s/\`Record\`s,
    # but this is just to enable smarter versioning. Can directly expose the \`Recordset\` fields for the GQL API
    column_defs: [ColumnDef]
    records: [Record]
    records_uploaded_by(uploader_email: String!): [Record]
  }

  type ColumnDef {
    ### Scalar fields
    name_en: String!
    name_fr: String!
    description_en: String!
    description_fr: String!
    data_type: String! # TODO will be an enum eventually
    
    ### Lang aware resolver scalar fields
    name: String!
    description: String!

    ### Non-scalar fields

    """
      \`Conditions\` array may be empty
    """
    conditions: [Condition!]!
  }

  type Condition {
    ### Scalar fields
    condition_type: String! # TODO will be an enum eventually

    """
      \`parameters\` array may be empty
    """
    parameters: [String!]!
  }

  type Record {
    ### Scalar fields
    data: JSON # https://the-guild.dev/graphql/scalars/docs/scalars/json
    created_at: Float

    ### Non-scalar fields
    created_by: User
  }

  scalar JSON
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
    User: {
      owned_collections: (
        parent: UserDocument,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) => CurrentCollectionsByOwnersLoader.load(parent._id.toString()),
      uploadable_collections: (
        parent: UserDocument,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) => CurrentCollectionsByUploadersLoader.load(parent._id.toString()),
    },
    Collection: {
      name: resolve_lang_suffixed_scalar('name'),
      description: resolve_lang_suffixed_scalar('description'),
      previous_version: (
        parent: CollectionDocument,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) =>
        parent.previous_version &&
        CollectionByIdLoader.load(parent.previous_version.toString()),
      created_by: (
        parent: CollectionDocument,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) => UserByIdLoader.load(parent.created_by.toString()),
      owners: (
        parent: CollectionDocument,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) =>
        UserByIdLoader.loadMany(
          parent.owners.map((object_id) => object_id.toString()),
        ),
      uploaders: (
        parent: CollectionDocument,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) =>
        typeof parent.uploaders === 'undefined'
          ? []
          : UserByIdLoader.loadMany(
              parent.uploaders.map((object_id) => object_id.toString()),
            ),
      column_defs: async (
        parent: CollectionDocument,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) => {
        const recordset = await RecordsetByIdLoader.load(
          parent.recordset.toString(),
        );
        return typeof recordset === 'undefined' ? [] : recordset.column_defs;
      },
      records: async (
        parent: CollectionDocument,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) => {
        const recordset = await RecordsetByIdLoader.load(
          parent.recordset.toString(),
        );
        return typeof recordset === 'undefined' ? [] : recordset.records;
      },
      records_uploaded_by: async (
        parent: CollectionDocument,
        { uploader_email }: { uploader_email: string },
        _context: unknown,
        _info: unknown,
      ) => {
        const user = await UserByEmailLoader.load(uploader_email);

        if (typeof user === 'undefined') {
          return [];
        }

        const recordset = await RecordsetByIdLoader.load(
          parent.recordset.toString(),
        );
        return typeof recordset === 'undefined'
          ? []
          : recordset.records.filter(
              ({ created_by }) => created_by === user._id,
            );
      },
    },
    ColumnDef: {
      name: resolve_lang_suffixed_scalar('name'),
      description: resolve_lang_suffixed_scalar('description'),
    },
    Record: {
      created_by: (
        parent: RecordInterface,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) => UserByIdLoader.load(parent.created_by.toString()),
    },
    JSON: JSONResolver,
  },
});
