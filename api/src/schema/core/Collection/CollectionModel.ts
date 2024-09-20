import { randomUUID } from 'crypto';

import _ from 'lodash';

import { Schema, model, Types } from 'mongoose';
import type { HydratedDocument } from 'mongoose';

import { db_transaction } from 'src/db.ts';

import { AppError } from 'src/error_utils.ts';

import type { UserDocument } from 'src/schema/core/User/UserModel.ts';
import type { LangSuffixedKeyUnion } from 'src/schema/lang_utils.ts';
import {
  create_dataloader_for_resource_by_primary_key_attr,
  create_dataloader_for_resources_by_foreign_key_attr,
} from 'src/schema/loader_utils.ts';
import {
  string_type_mixin,
  number_type_mixin,
  boolean_type_mixin,
  created_at_mixin,
  is_required_mixin,
  make_validation_mixin,
  make_string_min_length_validator,
  make_string_max_length_validator,
  make_lang_suffixed_type,
  make_foreign_id_type,
  make_foreign_key_type,
  with_uniqueness_validation_plugin,
} from 'src/schema/mongoose_utils.ts';

interface ConditionInterface {
  condition_type: string; // TODO this will be an enum once condition types are formalized
  parameters?: string[];
}
const ConditionSchema = new Schema<ConditionInterface>({
  condition_type: {
    ...string_type_mixin,
    ...is_required_mixin,
    // TODO validation
    immutable: true,
  },
  parameters: [
    {
      ...string_type_mixin,
      // TODO validation
      immutable: true,
    },
  ],
});

interface ColumnDefInterface
  extends Record<LangSuffixedKeyUnion<`name`>, string>,
    Record<LangSuffixedKeyUnion<`description`>, string> {
  header: string;
  data_type: string; // TODO this will be an enum once column types are formalized
  conditions: ConditionInterface[];
}
const ColumnDefSchema = new Schema<ColumnDefInterface>({
  ...make_lang_suffixed_type('name', {
    ...string_type_mixin,
    ...is_required_mixin,
    ...make_validation_mixin(
      make_string_min_length_validator(4),
      make_string_max_length_validator(150),
    ),
    immutable: true,
  }),
  ...make_lang_suffixed_type('description', {
    ...string_type_mixin,
    ...is_required_mixin,
    ...make_validation_mixin(
      make_string_min_length_validator(4),
      make_string_max_length_validator(3000),
    ),
    immutable: true,
  }),
  header: {
    ...string_type_mixin,
    ...is_required_mixin,
    ...make_validation_mixin(
      make_string_min_length_validator(1),
      make_string_max_length_validator(150),
    ),
    immutable: true,
  },
  data_type: {
    ...string_type_mixin,
    ...is_required_mixin,
    // TODO validation
    immutable: true,
  },
  conditions: [ConditionSchema],
});

export interface CollectionDefInterface
  extends Record<LangSuffixedKeyUnion<`name`>, string>,
    Record<LangSuffixedKeyUnion<`description`>, string> {
  owners: Types.ObjectId[];
  uploaders: Types.ObjectId[];
  is_locked: boolean;
}
const CollectionDefSchema = new Schema<CollectionDefInterface>({
  ...make_lang_suffixed_type('name', {
    ...string_type_mixin,
    ...is_required_mixin,
    ...make_validation_mixin(
      make_string_min_length_validator(4),
      make_string_max_length_validator(150),
    ),
    immutable: true,
  }),
  ...make_lang_suffixed_type('description', {
    ...string_type_mixin,
    ...is_required_mixin,
    ...make_validation_mixin(
      make_string_min_length_validator(4),
      make_string_max_length_validator(3000),
    ),
    immutable: true,
  }),
  owners: [
    {
      ...make_foreign_id_type('User', {
        required: true,
      }),
      immutable: true,
    },
  ],
  uploaders: [{ ...make_foreign_id_type('User'), immutable: true }],
  is_locked: { ...boolean_type_mixin, ...is_required_mixin, immutable: true },
});

interface CollectionInterface {
  stable_key: string;
  major_ver: number;
  minor_ver: number;
  is_current_version: boolean;
  created_by: Types.ObjectId;
  created_at: number;
  collection_def: CollectionDefInterface;
  column_defs: ColumnDefInterface[];
  recordset_key: string;
}
const CollectionMongooseSchema = new Schema<CollectionInterface>({
  stable_key: {
    ...string_type_mixin,
    ...is_required_mixin,
    immutable: true,
    index: true,
  },
  major_ver: {
    ...number_type_mixin,
    ...is_required_mixin,
    immutable: true,
    min: 1,
  },
  minor_ver: {
    ...number_type_mixin,
    ...is_required_mixin,
    immutable: true,
    min: 0,
  },
  is_current_version: { ...boolean_type_mixin, required: true },
  created_by: {
    ...make_foreign_id_type('User', {
      required: true,
    }),
    immutable: true,
  },
  created_at: {
    ...created_at_mixin,
    ...is_required_mixin,
    immutable: true,
  },

  collection_def: {
    type: CollectionDefSchema,
    ...is_required_mixin,
    immutable: true,
  },

  column_defs: {
    type: [ColumnDefSchema],
    requied: true,
    immutable: true,
  },

  recordset_key: {
    ...string_type_mixin,
    immutable: true,
    default: function () {
      return `${this.stable_key}_${this.major_ver}`;
    },
  },
});
CollectionMongooseSchema.index(
  { stable_key: 1, major_ver: 1, minor_ver: 1 },
  { unique: true },
);
CollectionMongooseSchema.index({
  is_current_version: 1,
  'collection_def.owners': 1,
});
CollectionMongooseSchema.index({
  is_current_version: 1,
  'collection_def.uploaders': 1,
});

export const CollectionModel = model(
  'Collection',
  with_uniqueness_validation_plugin(CollectionMongooseSchema),
);
export type CollectionDocument = HydratedDocument<CollectionInterface>;

export interface RecordInterface {
  recordset_key: string;
  data: Record<string, any>;
  created_by: Types.ObjectId;
  created_at: number;
}
const RecordMongooseSchema = new Schema<RecordInterface>({
  recordset_key: {
    ...make_foreign_key_type(String, 'Collection', {
      required: true,
      index: true,
    }),
    immutable: true,
  },
  data: Schema.Types.Mixed,
  created_by: {
    ...make_foreign_id_type('User', {
      required: true,
    }),
    immutable: true,
  },
  created_at: {
    ...created_at_mixin,
    ...is_required_mixin,
    immutable: true,
  },
});
RecordMongooseSchema.index({ recordset_key: 1, created_by: 1 });

export const RecordModel = model(
  'Record',
  with_uniqueness_validation_plugin(RecordMongooseSchema),
);
export type RecordDocument = HydratedDocument<RecordInterface>;

export const CollectionByIdLoader =
  create_dataloader_for_resource_by_primary_key_attr(CollectionModel, '_id');

export const CurrentCollectionsByOwnersLoader =
  create_dataloader_for_resources_by_foreign_key_attr(
    CollectionModel,
    'collection_def.owners',
    {
      constraints: { is_current_version: true },
    },
  );

export const CurrentCollectionsByUploadersLoader =
  create_dataloader_for_resources_by_foreign_key_attr(
    CollectionModel,
    'collection_def.uploaders',
    { constraints: { is_current_version: true } },
  );

export const AllCollectionVersionsByStableKeyLoader =
  create_dataloader_for_resources_by_foreign_key_attr(
    CollectionModel,
    'stable_key',
  );

export const RecordByIdLoader =
  create_dataloader_for_resource_by_primary_key_attr(RecordModel, '_id');

export const RecordsByRecordsetKeyLoader =
  create_dataloader_for_resources_by_foreign_key_attr(
    RecordModel,
    'recordset_key',
  );

export const make_records_created_by_user_loader_with_recordset_constraint = (
  recordset_key: string,
) =>
  create_dataloader_for_resources_by_foreign_key_attr(
    RecordModel,
    'created_by',
    {
      constraints: {
        recordset_key,
      },
    },
  );

type RecordDataValidation = Record<string, string>[];
export function validate_record_data_against_column_defs<
  Options extends { verbose: boolean },
>(
  column_defs: ColumnDefInterface[],
  data: Record<string, any>[], // TODO, could better type data records
  options?: Options,
): Options extends { verbose: true } ? RecordDataValidation : boolean;
export function validate_record_data_against_column_defs(
  _column_defs: ColumnDefInterface[],
  data: Record<string, any>[],
  options = { verbose: false },
): RecordDataValidation | boolean {
  // TODO, column def details (data types and constraints) and their validation will be a follow up PR

  if (options.verbose) {
    return _.map(data, undefined);
  } else {
    return true;
  }
}

export const are_new_column_defs_compatible_with_current_records = async (
  collection: CollectionDocument,
  new_column_defs: ColumnDefInterface[],
) => {
  const records = await RecordsByRecordsetKeyLoader.load(
    collection.recordset_key,
  );

  return validate_record_data_against_column_defs(
    new_column_defs,
    _.map(records, 'data'),
  );
};

export const create_collection = (
  user: UserDocument,
  collection_def: CollectionDefInterface,
  column_defs: ColumnDefInterface[],
) => {
  const created_by = user._id;

  return CollectionModel.create({
    // randomUUID uses an entropy cache by default, improves performance but loses entropy after 128 UUIDs
    stable_key: randomUUID({ disableEntropyCache: true }),
    major_ver: 1,
    minor_ver: 0,
    is_current_version: true,
    created_by,

    collection_def,

    column_defs: column_defs.map((column_def) => ({
      ...column_def,
      created_by,
    })),
  });
};

const create_collection_version = async (
  new_major_ver: number,
  new_minor_ver: number,
  current_collection: CollectionDocument,
  user: UserDocument,
  collection_def?: CollectionDefInterface,
  column_defs?: ColumnDefInterface[],
) => {
  const created_by = user._id;

  return db_transaction(async (session) => {
    const new_collection_version = new CollectionModel(
      {
        stable_key: current_collection.stable_key,
        major_ver: new_major_ver,
        minor_ver: new_minor_ver,
        is_current_version: true,
        created_by,

        collection_def: collection_def || current_collection.collection_def,
        column_defs: column_defs || current_collection.column_defs,
      },
      { session },
    );

    current_collection.is_current_version = false;

    await current_collection.save({ session });
    await new_collection_version.save({ session });

    return new_collection_version;
  });
};

const create_collection_new_minor_version = async (
  current_collection: CollectionDocument,
  user: UserDocument,
  collection_def?: CollectionDefInterface,
  column_defs?: ColumnDefInterface[],
) =>
  create_collection_version(
    current_collection.major_ver,
    current_collection.minor_ver + 1,
    current_collection,
    user,
    collection_def,
    column_defs,
  );

const create_collection_new_major_version = async (
  current_collection: CollectionDocument,
  user: UserDocument,
  collection_def?: CollectionDefInterface,
  column_defs?: ColumnDefInterface[],
) =>
  create_collection_version(
    current_collection.major_ver + 1,
    0,
    current_collection,
    user,
    collection_def,
    column_defs,
  );

// updating collection definition fields always bumps minor versions
export const update_collection_def_fields = (
  current_collection: CollectionDocument,
  user: UserDocument,
  new_collection_def: CollectionDefInterface,
) =>
  create_collection_new_minor_version(
    current_collection,
    user,
    new_collection_def,
  );

// Column definition updates _may_ result in a major version bump if compatibility breaks, minor version otherwise
export const update_collection_column_defs = async (
  current_collection: CollectionDocument,
  user: UserDocument,
  new_column_defs: ColumnDefInterface[],
) => {
  const created_by = user._id;

  const new_column_defs_with_meta = new_column_defs.map((column_def) => ({
    ...column_def,
    created_by,
  }));

  const is_update_a_breaking_change =
    await are_new_column_defs_compatible_with_current_records(
      current_collection,
      new_column_defs,
    );

  if (!is_update_a_breaking_change) {
    return create_collection_new_minor_version(
      current_collection,
      user,
      current_collection.collection_def,
      new_column_defs_with_meta,
    );
  } else {
    return create_collection_new_major_version(
      current_collection,
      user,
      current_collection.collection_def,
      new_column_defs_with_meta,
    );
  }
};

export const insert_records = async (
  collection: CollectionDocument,
  data: Record<string, any>[],
  user: UserDocument,
) => {
  if (!validate_record_data_against_column_defs(collection.column_defs, data)) {
    throw new AppError(400, 'Record validation failed');
  }

  // providing creation timestamp rather than leaving to default setter, to give
  // records created as a single transaction a consistent time stamp
  const created_at = Date.now();

  const record_documents = data.map((data) => ({
    data,
    recordset_key: collection.recordset_key,
    created_by: user._id,
    created_at,
  }));

  return await RecordModel.insertMany(record_documents);
};

export const delete_records = async (record_ids: Types.ObjectId[]) =>
  await RecordModel.deleteMany({
    _id: { $in: record_ids },
  });
