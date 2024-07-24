import { makeExecutableSchema } from '@graphql-tools/schema';
import { JSONResolver } from 'graphql-scalars';

import _ from 'lodash';

import {
  user_is_super_user_rule,
  user_can_have_privileges_rule,
  check_authz_rules,
} from 'src/authz.ts';
import {
  UserByEmailLoader,
  UserByIdLoader,
} from 'src/schema/core/User/UserModel.ts';
import type { UserDocument } from 'src/schema/core/User/UserModel.ts';
import type { LangsUnion } from 'src/schema/lang_utils.ts';
import {
  with_authz,
  resolve_document_id,
  resolve_lang_suffixed_scalar,
} from 'src/schema/resolver_utils.ts';

import {
  CollectionModel,
  CurrentCollectionsByOwnersLoader,
  CurrentCollectionsByUploadersLoader,
  AllCollectionVersionsByStableKeyLoader,
  create_collection_init,
  update_collection_def_fields,
  are_new_column_defs_compatible_with_current_records,
  update_collection_column_defs,
  validate_record_data_against_column_defs,
  insert_records,
  delete_records,
  RecordsByRecordsetKeyLoader,
  make_records_created_by_user_loader_with_recordset_constraint,
} from './CollectionModel.ts';
import type {
  CollectionDocument,
  CollectionDefInterface,
  ColumnDefInterfaceWithMetaOptional,
  RecordInterface,
} from './CollectionModel.ts';

const user_is_owner_of_collection = (
  user: UserDocument,
  collection: CollectionDocument,
) =>
  check_authz_rules(user, user_is_super_user_rule) ||
  (_.includes(collection.collection_def.owners, user._id) &&
    check_authz_rules(user, user_can_have_privileges_rule));

const user_is_uploader_for_collection = (
  user: UserDocument,
  collection: CollectionDocument,
) => _.includes(collection.collection_def.uploaders, user._id);

const user_can_edit_collection = (
  user: UserDocument,
  collection: CollectionDocument,
) =>
  collection.is_current_version &&
  user_is_owner_of_collection(user, collection);
const user_can_upload_to_collection = (
  user: UserDocument,
  collection: CollectionDocument,
) =>
  (collection.is_current_version &&
    user_is_owner_of_collection(user, collection)) ||
  (collection.is_current_version &&
    !collection.collection_def.is_locked &&
    user_is_uploader_for_collection(user, collection));

const user_can_edit_record = (
  user: UserDocument,
  collection: CollectionDocument,
  record: RecordInterface,
) =>
  (collection.is_current_version &&
    user_is_owner_of_collection(user, collection)) ||
  (collection.is_current_version &&
    !collection.collection_def.is_locked &&
    user_is_uploader_for_collection(user, collection) &&
    record.created_by === user._id);

const make_collection_def_scalar_resolver =
  <Key extends keyof CollectionDocument['collection_def']>(key: Key) =>
  (
    parent: CollectionDocument,
    _args: unknown,
    _context: unknown,
    _info: unknown,
  ) =>
    parent.collection_def[key];

export const CollectionSchema = makeExecutableSchema({
  typeDefs: `
  type QueryRoot {
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
    id: String!
    stable_key: String!
    sem_ver: String!
    is_current_version: Boolean!
    created_by: User!
    created_at: Float!
    
    ### Subdocument scalar fields
    name_en: String!
    name_fr: String!
    description_en: String!
    description_fr: String!
    is_locked: Boolean!

    ### Lang aware resolver subdocument scalar fields
    name: String!
    description: String!
    
    ### Non-scalar fields
    previous_versions: [Collection]
    
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
    id: String!
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
    id: String!
    data: JSON # https://the-guild.dev/graphql/scalars/docs/scalars/json
    created_at: Float

    ### Non-scalar fields
    created_by: User
  }

  scalar JSON

  type Mutation {
    create_collection_init(collection: CollectionInput): Collection
    create_collection_from_base(collection_id: String!): Collection

    # TODO need GQL schema types for collection update validation responses
    validate_collection_updates(collection_id: String!, collection_updates: CollectionInput): Boolean 
    update_collection(collection_id: String!, collection_updates: CollectionInput): Collection

    # TODO need GQL schema types for collection update validation responses
    validate_new_column_defs(collection_id: String!, column_defs: [ColumnDefInput]): Boolean 
    update_column_defs(collection_id: String!, column_defs: [ColumnDefInput]): Collection

    validate_new_records(collection_id: String!, records: [JSON]): Boolean # TODO need GQL schema types for record validation responses
    insert_records(collection_id: String!, records: [JSON]): [Record]
    delete_records(record_ids: [String!]!): [Record]
  }
  input CollectionInput {
    name_en: String!
    name_fr: String!
    description_en: String!
    description_fr: String!
    is_locked: Boolean!
    """
      \`owner_emails\` array parameter may be empty. The email of the user creating the collection is implicitly included
    """
    owner_emails: [String!]!
    """
      \`uploader_emails\` array parameter may be empty
    """
    uploader_emails: [String!]!
  }
  input ColumnDefInput {
    name_en: String!
    name_fr: String!
    description_en: String!
    description_fr: String!
    data_type: String!
    """
      \`conditions\` array parameter may be empty
    """
    conditions: [ConditionInput!]!
  }
  input ConditionInput {
    condition_type: String!
    parameters: [String!]!
  }
`,
  resolvers: {
    QueryRoot: {
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
        user_is_super_user_rule,
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
        user_is_super_user_rule,
      ),
      collections: with_authz(
        () => CollectionModel.find({ is_current_version: true }),
        user_is_super_user_rule,
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
      id: resolve_document_id,
      ...Object.fromEntries(
        // key array declared `as const` to preserve key string literals for the map function's type checking
        (
          [
            'name_en',
            'name_fr',
            'description_en',
            'description_fr',
            'is_locked',
          ] as const
        ).map((key) => [key, make_collection_def_scalar_resolver(key)]),
      ),
      name: (
        parent: CollectionDocument,
        _args: unknown,
        context: { lang: LangsUnion; req?: { user?: Express.User } },
        _info: unknown,
      ) =>
        resolve_lang_suffixed_scalar('name')(
          parent.collection_def,
          _args,
          context,
          _info,
        ),
      description: (
        parent: CollectionDocument,
        _args: unknown,
        context: { lang: LangsUnion; req?: { user?: Express.User } },
        _info: unknown,
      ) =>
        resolve_lang_suffixed_scalar('description')(
          parent.collection_def,
          _args,
          context,
          _info,
        ),
      previous_versions: (
        parent: CollectionDocument,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) => AllCollectionVersionsByStableKeyLoader.load(parent.stable_key),
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
          parent.collection_def.owners.map((object_id) => object_id.toString()),
        ),
      uploaders: (
        parent: CollectionDocument,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) =>
        typeof parent.collection_def.uploaders === 'undefined'
          ? []
          : UserByIdLoader.loadMany(
              parent.collection_def.uploaders.map((object_id) =>
                object_id.toString(),
              ),
            ),
      records: async (
        parent: CollectionDocument,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) => {
        const records = await RecordsByRecordsetKeyLoader.load(
          parent.recordset_key,
        );
        return typeof records === 'undefined' ? [] : records;
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

        const RecordsetRecordsByUserLoader =
          make_records_created_by_user_loader_with_recordset_constraint(
            parent.recordset_key,
          );

        const records = await RecordsetRecordsByUserLoader.load(
          user._id.toString(),
        );
        return typeof records === 'undefined' ? [] : records;
      },
    },
    ColumnDef: {
      id: resolve_document_id,
      name: resolve_lang_suffixed_scalar('name'),
      description: resolve_lang_suffixed_scalar('description'),
    },
    Record: {
      id: resolve_document_id,
      created_by: (
        parent: RecordInterface,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) => UserByIdLoader.load(parent.created_by.toString()),
    },
    JSON: JSONResolver,
    Mutation: _.mapValues({
      create_collection_init: (
        _parent: unknown,
        args: { collection_def: CollectionDefInterface },
        context: { req?: { user?: Express.User } },
        _info: unknown,
      ) => 'TODO',
      create_collection_from_base: (
        _parent: unknown,
        args: { collection_id: string },
        context: { req?: { user?: Express.User } },
        _info: unknown,
      ) => 'TODO',

      validate_collection_updates: (
        _parent: unknown,
        args: {
          collection_id: string;
          collection_updates: CollectionDefInterface;
        },
        context: { req?: { user?: Express.User } },
        _info: unknown,
      ) => 'TODO',
      update_collection: (
        _parent: unknown,
        args: {
          collection_id: string;
          collection_updates: CollectionDefInterface;
        },
        context: { req?: { user?: Express.User } },
        _info: unknown,
      ) => 'TODO',

      validate_new_column_defs: (
        _parent: unknown,
        args: {
          collection_id: string;
          column_defs: ColumnDefInterfaceWithMetaOptional[];
        },
        context: { req?: { user?: Express.User } },
        _info: unknown,
      ) => 'TODO',
      update_column_defs: (
        _parent: unknown,
        args: {
          collection_id: string;
          column_defs: ColumnDefInterfaceWithMetaOptional[];
        },
        context: { req?: { user?: Express.User } },
        _info: unknown,
      ) => 'TODO',

      validate_new_records: (
        _parent: unknown,
        args: { collection_id: string; records: JSON[] },
        context: { req?: { user?: Express.User } },
        _info: unknown,
      ) => 'TODO',
      insert_records: (
        _parent: unknown,
        args: { collection_id: string; records: JSON[] },
        context: { req?: { user?: Express.User } },
        _info: unknown,
      ) => 'TODO',
      delete_records: (
        _parent: unknown,
        args: { record_ids: string[] },
        context: { req?: { user?: Express.User } },
        _info: unknown,
      ) => 'TODO',
    }),
  },
});
