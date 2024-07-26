import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLError } from 'graphql';
import { JSONResolver } from 'graphql-scalars';

import _ from 'lodash';

import {
  user_is_super_user_rule,
  user_can_have_privileges_rule,
  user_email_allowed_rule,
  check_authz_rules,
} from 'src/authz.ts';

import { AppError } from 'src/error_utils.ts';

import {
  UserByEmailLoader,
  UserByIdLoader,
} from 'src/schema/core/User/UserModel.ts';
import type { UserDocument } from 'src/schema/core/User/UserModel.ts';
import type { LangsUnion } from 'src/schema/lang_utils.ts';
import {
  resolver_with_authz,
  resolve_document_id,
  resolve_lang_suffixed_scalar,
} from 'src/schema/resolver_utils.ts';

import {
  CollectionModel,
  CurrentCollectionsByOwnersLoader,
  CurrentCollectionsByUploadersLoader,
  AllCollectionVersionsByStableKeyLoader,
  create_collection,
  update_collection_def_fields,
  are_new_column_defs_compatible_with_current_records,
  update_collection_column_defs,
  validate_record_data_against_column_defs,
  insert_records,
  delete_records,
  RecordsByRecordsetKeyLoader,
  make_records_created_by_user_loader_with_recordset_constraint,
  CollectionByIdLoader,
  RecordByIdLoader,
} from './CollectionModel.ts';
import type {
  CollectionDocument,
  CollectionDefInterface,
  ColumnDefInterfaceWithMetaOptional,
  RecordInterface,
  RecordDocument,
} from './CollectionModel.ts';

const make_collection_def_scalar_resolver =
  <Key extends keyof CollectionDocument['collection_def']>(key: Key) =>
  (
    parent: CollectionDocument,
    _args: unknown,
    _context: unknown,
    _info: unknown,
  ) =>
    parent.collection_def[key];

type MutationAuthorizationRule = (
  user: Express.User,
  collection?: CollectionDocument,
  records?: RecordInterface[],
) => boolean;

const user_can_create_collection: MutationAuthorizationRule = (user) =>
  check_authz_rules(user, user_is_super_user_rule) ||
  check_authz_rules(user, user_can_have_privileges_rule);

const user_is_owner_of_collection: MutationAuthorizationRule = (
  user,
  collection,
) =>
  typeof collection !== 'undefined' &&
  _.includes(collection.collection_def.owners, user.mongoose_doc!._id) &&
  check_authz_rules(user, user_can_have_privileges_rule);

const user_is_uploader_for_collection: MutationAuthorizationRule = (
  user,
  collection,
) =>
  typeof collection !== 'undefined' &&
  _.includes(collection.collection_def.uploaders, user.mongoose_doc!._id) &&
  check_authz_rules(user, user_email_allowed_rule);

const user_can_edit_collection: MutationAuthorizationRule = (
  user,
  collection,
) =>
  typeof collection !== 'undefined' &&
  collection.is_current_version &&
  (check_authz_rules(user, user_is_super_user_rule) ||
    user_is_owner_of_collection(user, collection));

const user_can_upload_to_collection: MutationAuthorizationRule = (
  user,
  collection,
) =>
  typeof collection !== 'undefined' &&
  collection.is_current_version &&
  (check_authz_rules(user, user_is_super_user_rule) ||
    user_is_owner_of_collection(user, collection) ||
    (!collection.collection_def.is_locked &&
      user_is_uploader_for_collection(user, collection)));

const user_can_edit_records: MutationAuthorizationRule = (
  user,
  collection,
  records,
) =>
  typeof collection !== 'undefined' &&
  collection.is_current_version &&
  (check_authz_rules(user, user_is_super_user_rule) ||
    user_is_owner_of_collection(user, collection) ||
    (!collection.collection_def.is_locked &&
      user_is_uploader_for_collection(user, collection) &&
      _.every(
        records,
        (record) =>
          typeof record !== 'undefined' &&
          record.created_by === user.mongoose_doc!._id,
      )));

const validate_mutation_authorization = (
  mutation_name: string,
  user: Express.User | undefined,
  context: { collection?: CollectionDocument; records?: RecordInterface[] },
  ...mutation_rules: MutationAuthorizationRule[]
) => {
  if (typeof user === 'undefined') {
    throw new GraphQLError(
      `Action \`${mutation_name}\` requires authentication.`,
      {
        extensions: {
          code: 401,
        },
      },
    );
  } else if (typeof user.mongoose_doc === 'undefined') {
    // Should never happen, more than just a GraphQLError if it does occur
    throw new AppError(500, `User context is incomplete.`);
  } else if (
    !_.every(mutation_rules, (rule) =>
      rule(user, context.collection, context.records),
    )
  ) {
    throw new GraphQLError(
      `Action \`${mutation_name}\` has unmet authorization requirements.`,
      {
        extensions: {
          code: 403,
        },
      },
    );
  }
};

type CollectionDefInput = {
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  is_locked: boolean;
  owner_emails: string[];
  uploader_emails: string[];
};
type ColumnDefInput = {
  header: string;
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  data_type: string;
  conditions: ConditionInput[];
};
type ConditionInput = {
  condition_type: string;
  parameters: string[];
};

const collection_def_input_to_mongo_values = (
  collection_input: CollectionDefInput,
): CollectionDefInterface => {
  const { owner_emails, uploader_emails, ...passthrough_fields } =
    collection_input;

  return {
    ...passthrough_fields,
    owners: [],
    uploaders: [],
  };
};

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
    major_ver: String!
    minor_ver: String!
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
    header: String!
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
    create_collection_init(collection_def: CollectionDefInput): Collection
    create_collection_from_base(collection_id: String!): Collection

    # TODO need GQL schema types for collection update validation responses
    update_collection(collection_id: String!, collection_updates: CollectionDefInput): Collection

    # TODO need GQL schema types for collection update validation responses
    validate_new_column_defs(collection_id: String!, column_defs: [ColumnDefInput]): Boolean 
    update_column_defs(collection_id: String!, column_defs: [ColumnDefInput]): Collection

    validate_new_records(collection_id: String!, records: [JSON]): Boolean # TODO need GQL schema types for record validation responses
    insert_records(collection_id: String!, records: [JSON]): [Record]
    delete_records(collection_id: String!, record_ids: [String!]!): [Record]
  }
  input CollectionDefInput {
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
      user_owned_collections: resolver_with_authz(
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
      user_uploadable_collections: resolver_with_authz(
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
      collections: resolver_with_authz(
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
    Mutation: {
      create_collection_init: async (
        _parent: unknown,
        { collection_def }: { collection_def: CollectionDefInput },
        { req: { user } }: { req: { user?: Express.User } },
        { fieldName }: { fieldName: string },
      ) => {
        validate_mutation_authorization(
          fieldName,
          user,
          {},
          user_can_create_collection,
        );

        return create_collection(
          user!.mongoose_doc!,
          collection_def_input_to_mongo_values(collection_def),
          [],
        );
      },
      create_collection_from_base: async (
        _parent: unknown,
        { collection_id }: { collection_id: string },
        { req: { user } }: { req: { user?: Express.User } },
        { fieldName }: { fieldName: string },
      ) => {
        const base_collection = await CollectionByIdLoader.load(collection_id);

        validate_mutation_authorization(
          fieldName,
          user,
          { collection: base_collection },
          user_can_create_collection,
          user_can_edit_collection,
        );

        return create_collection(
          user!.mongoose_doc!,
          base_collection!.collection_def,
          base_collection!.column_defs,
        );
      },

      update_collection: async (
        _parent: unknown,
        {
          collection_id,
          collection_updates,
        }: {
          collection_id: string;
          collection_updates: CollectionDefInput;
        },
        { req: { user } }: { req: { user?: Express.User } },
        { fieldName }: { fieldName: string },
      ) => {
        const collection = await CollectionByIdLoader.load(collection_id);

        validate_mutation_authorization(
          fieldName,
          user,
          { collection },
          user_can_edit_collection,
        );

        return update_collection_def_fields(
          collection!,
          user!.mongoose_doc!,
          collection_def_input_to_mongo_values(collection_updates),
        );
      },

      validate_new_column_defs: async (
        _parent: unknown,
        {
          collection_id,
          column_defs,
        }: {
          collection_id: string;
          column_defs: ColumnDefInput[];
        },
        { req: { user } }: { req: { user?: Express.User } },
        { fieldName }: { fieldName: string },
      ) => {
        const collection = await CollectionByIdLoader.load(collection_id);

        validate_mutation_authorization(
          fieldName,
          user,
          { collection },
          user_can_edit_collection,
        );

        return are_new_column_defs_compatible_with_current_records(
          collection!,
          column_defs,
        );
      },
      update_column_defs: async (
        _parent: unknown,
        {
          collection_id,
          column_defs,
        }: {
          collection_id: string;
          column_defs: ColumnDefInput[];
        },
        { req: { user } }: { req: { user?: Express.User } },
        { fieldName }: { fieldName: string },
      ) => {
        const collection = await CollectionByIdLoader.load(collection_id);

        validate_mutation_authorization(
          fieldName,
          user,
          { collection },
          user_can_edit_collection,
        );

        return update_collection_column_defs(
          collection!,
          user!.mongoose_doc!,
          column_defs,
        );
      },

      validate_new_records: async (
        _parent: unknown,
        { collection_id, records }: { collection_id: string; records: JSON[] },
        { req: { user } }: { req: { user?: Express.User } },
        { fieldName }: { fieldName: string },
      ) => {
        const collection = await CollectionByIdLoader.load(collection_id);

        validate_mutation_authorization(
          fieldName,
          user,
          { collection },
          user_can_upload_to_collection,
        );

        return validate_record_data_against_column_defs(
          collection!.column_defs,
          records,
          true,
        );
      },
      insert_records: async (
        _parent: unknown,
        { collection_id, records }: { collection_id: string; records: JSON[] },
        { req: { user } }: { req: { user?: Express.User } },
        { fieldName }: { fieldName: string },
      ) => {
        const collection = await CollectionByIdLoader.load(collection_id);

        validate_mutation_authorization(
          fieldName,
          user,
          { collection },
          user_can_upload_to_collection,
        );

        return insert_records(collection!, records, user!.mongoose_doc!);
      },
      delete_records: async (
        _parent: unknown,
        {
          collection_id,
          record_ids,
        }: { collection_id: string; record_ids: string[] },
        { req: { user } }: { req: { user?: Express.User } },
        { fieldName }: { fieldName: string },
      ) => {
        const collection = await CollectionByIdLoader.load(collection_id);
        const requested_records = await RecordByIdLoader.loadMany(record_ids);

        const valid_requested_records = requested_records.filter(
          (record, index): record is RecordDocument =>
            typeof record !== 'undefined' &&
            '_id' in record &&
            record._id.toString() === record_ids[index],
        );

        validate_mutation_authorization(
          fieldName,
          user,
          { collection, records: valid_requested_records },
          user_can_edit_records,
        );

        return delete_records(
          valid_requested_records.map((record) => record._id),
        );
      },
    },
  },
});
