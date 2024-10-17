import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLError } from 'graphql';
import { JSONResolver } from 'graphql-scalars';

import _ from 'lodash';

import {
  user_email_is_super_user_rule,
  user_email_can_own_collections_rule,
  user_email_allowed_rule,
  check_authz_rules,
} from 'src/authz.ts';

import { app_error_to_gql_error } from 'src/error_utils.ts';

import {
  UserByEmailLoader,
  UserByIdLoader,
  get_or_create_users,
} from 'src/schema/core/User/UserModel.ts';
import type { UserDocument } from 'src/schema/core/User/UserModel.ts';
import { get_validation_errors } from 'src/schema/mongoose_schema_utils/validation_utils.ts';
import {
  resolver_with_authz,
  resolve_document_id,
  make_deep_lang_suffixed_scalar_resolver,
  make_deep_scalar_resolver,
} from 'src/schema/resolver_utils.ts';

import {
  CollectionModel,
  CurrentCollectionsByOwnersLoader,
  CurrentCollectionsByUploadersLoader,
  AllCollectionVersionsByStableKeyLoader,
  CurrentCollectionByRecordsetKeyLoader,
  ColumnDefModel,
  ColumnDefsByRecordsetKeyLoader,
  RecordsByRecordsetKeyLoader,
  create_collection,
  update_collection_def,
  update_column_def_on_collection,
  create_column_defs_on_collection,
  validate_record_data_against_column_defs,
  insert_records,
  delete_records,
  make_records_created_by_user_loader_with_recordset_constraint,
  CollectionByIdLoader,
  RecordByIdLoader,
  ColumnDefByIdLoader,
} from './CollectionModel.ts';
import type {
  CollectionDataInterface,
  CollectionDocument,
  RecordInterface,
  RecordDocument,
  ColumnDefInterface,
  CollectionInterface,
} from './CollectionModel.ts';

const user_can_be_collection_owner = (user: Express.User) =>
  check_authz_rules(user, user_email_is_super_user_rule) ||
  check_authz_rules(user, user_email_can_own_collections_rule);

const user_can_be_collection_uploader = (user: Express.User) =>
  check_authz_rules(user, user_email_allowed_rule);

const make_authroization_error = (operation_name: string) =>
  // TODO may need i18n, but I'm leaning towards having the client side handle 403's in a generic manner,
  // with this error message just being for our logs
  new GraphQLError(`${operation_name} has unmet authorization requirements.`, {
    extensions: {
      code: 403,
    },
  });

type CollectionLevelAuthzRule = (
  user: Express.User,
  collection: CollectionDocument,
) => boolean;
// Reminder: TS assertion functions can't be arrow functions
function validate_collection_level_authorization(
  operation_name: string,
  user: Express.AuthenticatedUser,
  collection: CollectionDocument | undefined,
  ...collection_level_authz_rules: CollectionLevelAuthzRule[]
): asserts collection is CollectionDocument {
  if (
    typeof collection !== 'undefined' &&
    !_.every(collection_level_authz_rules, (rule) => rule(user, collection))
  ) {
    throw make_authroization_error(operation_name);
  }
}

type RecordLevelAuthzRule = (
  user: Express.User,
  collection: CollectionDocument,
  records: RecordInterface[],
) => boolean;
// Reminder: TS assertion functions can't be arrow functions
function validate_record_level_authorization(
  operation_name: string,
  user: Express.AuthenticatedUser,
  collection: CollectionDocument | undefined,
  records: RecordInterface[] | undefined,
  ...record_level_authz_rules: RecordLevelAuthzRule[]
): asserts collection is CollectionDocument {
  if (
    typeof collection !== 'undefined' &&
    typeof records !== 'undefined' &&
    !_.every(record_level_authz_rules, (rule) =>
      rule(user, collection, records),
    )
  ) {
    throw make_authroization_error(operation_name);
  }
}

const user_is_owner_of_collection: CollectionLevelAuthzRule = (
  user,
  collection,
) =>
  user_can_be_collection_owner(user) &&
  (check_authz_rules(user, user_email_is_super_user_rule) ||
    _.some(collection.data.owners, (owner_id) =>
      owner_id.equals(user.mongoose_doc?._id),
    ));

const user_is_uploader_for_collection: CollectionLevelAuthzRule = (
  user,
  collection,
) =>
  _.some(collection.data.uploaders, (uploader_id) =>
    uploader_id.equals(user.mongoose_doc?._id),
  ) && user_can_be_collection_uploader(user);

const user_can_view_collection: CollectionLevelAuthzRule = (user, collection) =>
  user_is_owner_of_collection(user, collection) ||
  (!collection.data.is_locked &&
    user_is_uploader_for_collection(user, collection));

const user_can_upload_to_collection: CollectionLevelAuthzRule = (
  user,
  collection,
) =>
  collection.meta.is_current_version &&
  user_can_view_collection(user, collection);

const user_can_edit_collection: CollectionLevelAuthzRule = (user, collection) =>
  collection.meta.is_current_version &&
  user_is_owner_of_collection(user, collection);

const user_can_view_records: RecordLevelAuthzRule = (
  user,
  collection,
  records,
) =>
  _.every(
    records,
    (record) => record.meta.recordset_key === collection.meta.recordset_key,
  ) &&
  user_can_view_collection(user, collection) &&
  (user_is_owner_of_collection(user, collection) ||
    (!collection.data.is_locked &&
      user_is_uploader_for_collection(user, collection) &&
      _.every(
        records,
        (record) =>
          typeof record !== 'undefined' &&
          record.meta.created_by.equals(user.mongoose_doc?._id),
      )));

const user_can_edit_records: RecordLevelAuthzRule = (
  user,
  collection,
  records,
) =>
  collection.meta.is_current_version &&
  user_can_view_records(user, collection, records);

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

const add_user_to_collection_def_input_owners = (
  collection_input: CollectionDefInput,
  session_user: Express.AuthenticatedUser,
): CollectionDefInput => ({
  ...collection_input,
  owner_emails: _.uniq([...collection_input.owner_emails, session_user.email]),
});

const collection_def_input_to_model_data_fields = async (
  collection_input: CollectionDefInput,
): Promise<CollectionDataInterface> => {
  const { owner_emails, uploader_emails, ...passthrough_fields } =
    collection_input;

  const all_emails = [...owner_emails, ...uploader_emails];

  const maybe_users = await UserByEmailLoader.loadMany(all_emails);
  const maybe_users_by_email = _.zip(all_emails, maybe_users);

  const user_is_missing = (maybe_user: (typeof maybe_users)[number]) =>
    maybe_user instanceof Error || typeof maybe_user === 'undefined';

  const missing_user_emails = _.chain(maybe_users_by_email)
    .filter(([_email, maybe_user]) => user_is_missing(maybe_user))
    .map(([email, _missing_user]) => email)
    .value();
  if (!_.isEmpty(missing_user_emails)) {
    throw new Error(
      `\`collection_def_input\` can not be converted to valid model fields, includes emails with no corresponding users: \`[${missing_user_emails.join(', ')}]\``,
    );
  }

  const user_ids_by_email = _.chain(maybe_users_by_email)
    .filter(
      (email_and_maybe_user): email_and_maybe_user is [string, UserDocument] =>
        !user_is_missing(email_and_maybe_user[1]),
    )
    .map(([email, user]): [string, UserDocument['_id']] => [email, user._id])
    .fromPairs()
    .value();

  return {
    ...passthrough_fields,
    owners: _.map(owner_emails, (email) => user_ids_by_email[email]),
    uploaders: _.map(uploader_emails, (email) => user_ids_by_email[email]),
  };
};

export const CollectionSchema = makeExecutableSchema({
  typeDefs: `
  type Query { 
    collection(collection_id: String!): Collection!
    column_def(column_id: String!): ColumnDef!
    record(record_id: String!): Record!

    user_owned_collections(email: String!): [Collection]
    user_uploadable_collections(email: String!): [Collection]
    all_collections: [Collection]

    validate_collection_def(collection_def: CollectionDefInput!): CollectionDefValidation!
    validate_column_def(collection_id: String!, is_new_column: Boolean!, column_def: ColumnDefInput!): ColumnDefValidation
    validate_records(collection_id: String!, records: [JSON!]!): [JSON!]!
  }

  type Mutation {
    create_collection(collection_def: CollectionDefInput): Collection!
    update_collection(collection_id: String!, collection_def: CollectionDefInput): Collection!

    create_column_def(collection_id: String!, column_def: ColumnDefInput): Collection!
    update_column_def(collection_id: String!, column_id: String!, column_def: ColumnDefInput): Collection!

    insert_records(collection_id: String!, records: [JSON]): [Record]
    delete_records(collection_id: String!, record_ids: [String!]!): Int
  }

  input CollectionDefInput {
    name_en: String!
    name_fr: String!
    description_en: String!
    description_fr: String!
    is_locked: Boolean!
    """
      \`owner_emails\` array parameter may be an empty list. The email of the user creating the collection is implicitly included
    """
    owner_emails: [String!]!
    """
      \`uploader_emails\` array parameter may be an empty list.
    """
    uploader_emails: [String!]!
  }
  type CollectionDefValidation {
    name_en: ValidationMessages
    name_fr: ValidationMessages
    description_en: ValidationMessages
    description_fr: ValidationMessages
    is_locked: ValidationMessages
    owner_emails: [ValidationMessages]!
    uploader_emails: [ValidationMessages]!
  } 

  input ColumnDefInput {
    header: String!
    name_en: String!
    name_fr: String!
    description_en: String!
    description_fr: String!
    data_type: String!
    """
      \`conditions\` array parameter may be empty
    """
    conditions: [ConditionInput]!
  }
  input ConditionInput {
    condition_type: String!
    parameters: [String]!
  }
  type ColumnDefValidation {
    id: String!
    header: ValidationMessages
    name_en: ValidationMessages
    name_fr: ValidationMessages
    description_en: ValidationMessages
    description_fr: ValidationMessages
    data_type: ValidationMessages
    conditions: [ValidationMessages]
  }

  type ValidationMessages {
    en: String
    fr: String
  }

  type User {
    owned_collections: [Collection!]!
    uploadable_collections: [Collection!]!
  }
  
  type Collection {
    id: String!
    
    ### collection.meta scalar fields
    stable_key: String!
    major_ver: Int!
    minor_ver: Int!
    is_current_version: Boolean!
    created_at: Float!
    
    ### collection.data scalar fields
    name_en: String!
    name_fr: String!
    description_en: String!
    description_fr: String!
    is_locked: Boolean!

    ### Lang aware resolver subdocument scalar fields
    name(lang: String!): String!
    description(lang: String!): String!
    
    ### Non-scalar fields
    created_by: User!
    previous_versions: [Collection]
    
    """
      \`owners\` array will be non-empty
    """
    owners: [User!]! # note: these !'s mean neither the field itself nor elements of the array may be null, but it doesn't enforce that the array is non-empty

    """
      \`uploaders\` array may be empty
    """
    uploaders: [User!]! # note: these !'s mean neither the field itself nor elements of the array may be null, but it doesn't enforce that the array is non-empty

    column_defs: [ColumnDef!]!
    
    """
      \`uploader_email\` defaults to the email of the current user session
    """
    records_uploaded_by(uploader_email: String): [Record]
    records: [Record]
    
  }

  type ColumnDef {
    id: String!
    
    ### columnd_def.data scalar fields
    header: String!
    name_en: String!
    name_fr: String!
    description_en: String!
    description_fr: String!
    data_type: String! # TODO will be an enum eventually
    
    ### Lang aware resolver scalar fields
    name(lang: String!): String!
    description(lang: String!): String!

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
    id: String!
    
    data: JSON # https://the-guild.dev/graphql/scalars/docs/scalars/json
    
    ### record.meta scalar fields
    created_at: Float

    ### Non-scalar fields
    created_by: User
  }

  scalar JSON
`,
  resolvers: {
    Query: {
      collection: resolver_with_authz(
        async (
          _parent: unknown,
          { collection_id }: { collection_id: string },
          context,
          { fieldName }: { fieldName: string },
        ) => {
          const collection = await CollectionByIdLoader.load(collection_id);

          validate_collection_level_authorization(
            `Query \`${fieldName}\``,
            context.req.user,
            collection,
            user_can_view_collection,
          );

          return collection;
        },
      ),
      column_def: resolver_with_authz(
        async (
          _parent: unknown,
          { column_id }: { column_id: string },
          context,
          { fieldName }: { fieldName: string },
        ) => {
          const column_def = await ColumnDefByIdLoader.load(column_id);

          const operation_name = `Query \`${fieldName}\``;
          if (typeof column_def === 'undefined') {
            // Cannot validate authorization if the column doesn't exist
            throw make_authroization_error(operation_name);
          } else {
            const collection = await CurrentCollectionByRecordsetKeyLoader.load(
              column_def.meta.recordset_key,
            );
            validate_collection_level_authorization(
              operation_name,
              context.req.user,
              collection,
              user_can_view_collection,
            );

            return column_def;
          }
        },
      ),
      record: resolver_with_authz(
        async (
          _parent: unknown,
          { record_id }: { record_id: string },
          context,
          { fieldName }: { fieldName: string },
        ) => {
          const record = await RecordByIdLoader.load(record_id);

          const operation_name = `Query \`${fieldName}\``;
          if (typeof record === 'undefined') {
            // Cannot validate authorization if the record doesn't exist
            throw make_authroization_error(operation_name);
          } else {
            const collection = await CurrentCollectionByRecordsetKeyLoader.load(
              record.meta.recordset_key,
            );

            validate_record_level_authorization(
              operation_name,
              context.req.user,
              collection,
              typeof record !== 'undefined' ? [record] : [],
              user_can_view_records,
            );

            return record;
          }
        },
      ),

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
        user_email_is_super_user_rule,
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
        user_email_is_super_user_rule,
      ),
      all_collections: resolver_with_authz(
        () => CollectionModel.find({ 'meta.is_current_version': true }),
        user_email_is_super_user_rule,
      ),

      validate_collection_def: resolver_with_authz(
        async (
          _parent: unknown,
          { collection_def }: { collection_def: CollectionDefInput },
          _info: unknown,
        ) => {
          const { owner_emails, uploader_emails } = collection_def;

          const model_ready_collection_def =
            await collection_def_input_to_model_data_fields({
              ...collection_def,
              owner_emails: [],
              uploader_emails: [],
            });

          const model_validation_errors = await get_validation_errors(
            CollectionModel,
            { data: model_ready_collection_def },
            ['data'],
          );

          return {
            ...(model_validation_errors?.data ?? {}),
            owner_emails: _.map(owner_emails, (email) =>
              check_authz_rules({ email }, user_email_is_super_user_rule) ||
              check_authz_rules({ email }, user_email_can_own_collections_rule)
                ? null
                : { en: 'Not a valid owner email', fr: 'TODO' },
            ),
            uploader_emails: _.map(uploader_emails, (email) =>
              check_authz_rules({ email }, user_email_allowed_rule)
                ? null
                : { en: 'Not a valid uploader email', fr: 'TODO' },
            ),
          };
        },
        user_can_be_collection_owner,
      ),
      validate_column_def: resolver_with_authz(
        async (
          _parent: unknown,
          {
            collection_id,
            is_new_column,
            column_def,
          }: {
            collection_id: string;
            is_new_column: boolean;
            column_def: ColumnDefInput;
          },
          context,
          { fieldName }: { fieldName: string },
        ) => {
          const collection = await CollectionByIdLoader.load(collection_id);

          validate_collection_level_authorization(
            `Action \`${fieldName}\``,
            context.req.user,
            collection,
            user_can_edit_collection,
          );

          const model_validation_errors = await get_validation_errors(
            ColumnDefModel,
            {
              data: column_def,
              meta: { recordset_key: collection.meta.recordset_key },
            },
            _.chain(ColumnDefModel.schema.obj.data)
              .keys()
              .thru((keys) =>
                !is_new_column ? _.without(keys, 'header') : keys,
              )
              .map((key_in_data) => `data.${key_in_data}`)
              .concat('meta.recordset_key')
              .value(),
          );

          return model_validation_errors?.data;
        },
      ),
      validate_records: resolver_with_authz(
        async (
          _parent: unknown,
          {
            collection_id,
            records,
          }: { collection_id: string; records: JSON[] },
          context,
          { fieldName }: { fieldName: string },
        ) => {
          const collection = await CollectionByIdLoader.load(collection_id);

          validate_collection_level_authorization(
            `Action \`${fieldName}\``,
            context.req.user,
            collection,
            user_can_upload_to_collection,
          );

          const column_defs = await ColumnDefsByRecordsetKeyLoader.load(
            collection.meta.recordset_key,
          );

          try {
            return validate_record_data_against_column_defs(
              column_defs.map((column_def) => column_def.data),
              records,
              { verbose: true },
            );

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            throw app_error_to_gql_error(error);
          }
        },
      ),
    },

    Mutation: {
      create_collection: resolver_with_authz(
        async (
          _parent: unknown,
          { collection_def }: { collection_def: CollectionDefInput },
          context,
          { fieldName }: { fieldName: string },
        ) => {
          if (!user_can_be_collection_owner(context.req.user)) {
            throw make_authroization_error(`Action \`${fieldName}\``);
          }

          try {
            await get_or_create_users([
              ...collection_def.owner_emails,
              ...collection_def.uploader_emails,
            ]);

            const model_ready_collection_def =
              await collection_def_input_to_model_data_fields(
                add_user_to_collection_def_input_owners(
                  collection_def,
                  context.req.user,
                ),
              );

            return create_collection(
              context.req.user.mongoose_doc,
              model_ready_collection_def,
              [],
            );

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            throw app_error_to_gql_error(error);
          }
        },
      ),

      update_collection: resolver_with_authz(
        async (
          _parent: unknown,
          {
            collection_id,
            collection_def,
          }: {
            collection_id: string;
            collection_def: CollectionDefInput;
          },
          context,
          { fieldName }: { fieldName: string },
        ) => {
          const collection = await CollectionByIdLoader.load(collection_id);

          validate_collection_level_authorization(
            `Action \`${fieldName}\``,
            context.req.user,
            collection,
            user_can_edit_collection,
          );

          try {
            await get_or_create_users([
              ...collection_def.owner_emails,
              ...collection_def.uploader_emails,
            ]);

            const model_ready_collection_def =
              await collection_def_input_to_model_data_fields(
                add_user_to_collection_def_input_owners(
                  collection_def,
                  context.req.user,
                ),
              );

            return update_collection_def(
              context.req.user.mongoose_doc,
              collection,
              model_ready_collection_def,
            );

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            throw app_error_to_gql_error(error);
          }
        },
      ),

      create_column_def: resolver_with_authz(
        async (
          _parent: unknown,
          {
            collection_id,
            column_def,
          }: {
            collection_id: string;
            column_def: ColumnDefInput;
          },
          context,
          { fieldName }: { fieldName: string },
        ) => {
          const collection = await CollectionByIdLoader.load(collection_id);

          validate_collection_level_authorization(
            `Action \`${fieldName}\``,
            context.req.user,
            collection,
            user_can_edit_collection,
          );

          try {
            return create_column_defs_on_collection(
              context.req.user.mongoose_doc,
              collection,
              [column_def],
            );

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            throw app_error_to_gql_error(error);
          }
        },
      ),
      update_column_def: resolver_with_authz(
        async (
          _parent: unknown,
          {
            collection_id,
            column_id,
            column_def,
          }: {
            collection_id: string;
            column_id: string;
            column_def: ColumnDefInput;
          },
          context,
          { fieldName }: { fieldName: string },
        ) => {
          const collection = await CollectionByIdLoader.load(collection_id);

          validate_collection_level_authorization(
            `Action \`${fieldName}\``,
            context.req.user,
            collection,
            user_can_edit_collection,
          );

          try {
            return update_column_def_on_collection(
              context.req.user.mongoose_doc,
              collection,
              column_id,
              column_def,
            );

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            throw app_error_to_gql_error(error);
          }
        },
      ),

      insert_records: resolver_with_authz(
        async (
          _parent: unknown,
          {
            collection_id,
            records,
          }: { collection_id: string; records: JSON[] },
          context,
          { fieldName }: { fieldName: string },
        ) => {
          const collection = await CollectionByIdLoader.load(collection_id);

          validate_collection_level_authorization(
            `Action \`${fieldName}\``,
            context.req.user,
            collection,
            user_can_upload_to_collection,
          );

          try {
            return insert_records(
              context.req.user.mongoose_doc,
              collection,
              records,
            );

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            throw app_error_to_gql_error(error);
          }
        },
      ),
      delete_records: resolver_with_authz(
        async (
          _parent: unknown,
          {
            collection_id,
            record_ids,
          }: { collection_id: string; record_ids: string[] },
          context,
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

          validate_record_level_authorization(
            `Action \`${fieldName}\``,
            context.req.user,
            collection,
            valid_requested_records,
            user_can_edit_records,
          );

          try {
            const delete_result = await delete_records(
              valid_requested_records.map((record) => record._id),
            );
            return delete_result.deletedCount;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            throw app_error_to_gql_error(error);
          }
        },
      ),
    },

    User: {
      owned_collections: (
        parent: UserDocument,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) => {
        if (check_authz_rules(parent, user_email_is_super_user_rule)) {
          return CollectionModel.find({ 'meta.is_current_version': true });
        } else {
          return CurrentCollectionsByOwnersLoader.load(parent._id.toString());
        }
      },
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
        ).map((key) => [
          key,
          make_deep_scalar_resolver<CollectionInterface>()(`data.${key}`),
        ]),
      ),
      ...Object.fromEntries(
        // key array declared `as const` to preserve key string literals for the map function's type checking
        (
          [
            'stable_key',
            'major_ver',
            'minor_ver',
            'is_current_version',
            'created_at',
          ] as const
        ).map((key) => [
          key,
          make_deep_scalar_resolver<CollectionInterface>()(`meta.${key}`),
        ]),
      ),
      ...Object.fromEntries(
        // key array declared `as const` to preserve key string literals for the map function's type checking
        (['name', 'description'] as const).map((key) => [
          key,
          make_deep_lang_suffixed_scalar_resolver<CollectionInterface>()(
            `data.${key}`,
          ),
        ]),
      ),
      previous_versions: async (
        parent: CollectionDocument,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) => {
        const all_collections_by_stable_key =
          await AllCollectionVersionsByStableKeyLoader.load(
            parent.meta.stable_key,
          );
        return _.filter(
          all_collections_by_stable_key,
          ({ _id }) => _id.toString() !== parent._id.toString(),
        );
      },
      created_by: (
        parent: CollectionDocument,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) => UserByIdLoader.load(parent.meta.created_by.toString()),
      owners: (
        parent: CollectionDocument,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) =>
        UserByIdLoader.loadMany(
          parent.data.owners.map((object_id) => object_id.toString()),
        ),
      uploaders: (
        parent: CollectionDocument,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) =>
        typeof parent.data.uploaders === 'undefined'
          ? []
          : UserByIdLoader.loadMany(
              parent.data.uploaders.map((object_id) => object_id.toString()),
            ),
      column_defs: (
        parent: CollectionDocument,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) => ColumnDefsByRecordsetKeyLoader.load(parent.meta.recordset_key),
      records_uploaded_by: resolver_with_authz(
        async (
          parent: CollectionDocument,
          { uploader_email }: { uploader_email?: string },
          context,
          { fieldName }: { fieldName: string },
        ) => {
          validate_collection_level_authorization(
            `Query \`${fieldName}\``,
            context.req.user,
            parent,
            user_can_view_collection,
          );

          const email_to_query =
            typeof uploader_email === 'undefined'
              ? context.req.user.email
              : uploader_email;

          const user = await UserByEmailLoader.load(email_to_query);

          if (typeof user === 'undefined') {
            return [];
          }

          const RecordsetRecordsByUserLoader =
            make_records_created_by_user_loader_with_recordset_constraint(
              parent.meta.recordset_key,
            );

          const records = await RecordsetRecordsByUserLoader.load(
            user._id.toString(),
          );

          validate_record_level_authorization(
            `Query \`${fieldName}\``,
            context.req.user,
            parent,
            records,
            user_can_view_records,
          );

          return typeof records === 'undefined' ? [] : records;
        },
      ),
      records: resolver_with_authz(
        async (
          parent: CollectionDocument,
          _args: unknown,
          context,
          { fieldName }: { fieldName: string },
        ) => {
          validate_collection_level_authorization(
            `Query \`${fieldName}\``,
            context.req.user,
            parent,
            user_is_owner_of_collection,
          );

          const records = await RecordsByRecordsetKeyLoader.load(
            parent.meta.recordset_key,
          );
          return typeof records === 'undefined' ? [] : records;
        },
      ),
    },

    ColumnDef: {
      id: resolve_document_id,
      ...Object.fromEntries(
        // key array declared `as const` to preserve key string literals for the map function's type checking
        (
          [
            'header',
            'data_type',
            'conditions',
            'name_en',
            'name_fr',
            'description_en',
            'description_fr',
          ] as const
        ).map((key) => [
          key,
          make_deep_scalar_resolver<ColumnDefInterface>()(`data.${key}`),
        ]),
      ),
      ...Object.fromEntries(
        // key array declared `as const` to preserve key string literals for the map function's type checking
        (['name', 'description'] as const).map((key) => [
          key,
          make_deep_lang_suffixed_scalar_resolver<ColumnDefInterface>()(
            `data.${key}`,
          ),
        ]),
      ),
    },

    Record: {
      id: resolve_document_id,
      created_at:
        make_deep_scalar_resolver<RecordInterface>()('meta.created_at'),
      created_by: (
        parent: RecordInterface,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) => UserByIdLoader.load(parent.meta.created_by.toString()),
    },

    JSON: JSONResolver,
  },
});
