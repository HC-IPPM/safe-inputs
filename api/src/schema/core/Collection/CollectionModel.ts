import { randomUUID } from 'crypto';

import _ from 'lodash';

import { Schema, model, Types } from 'mongoose';
import type { HydratedDocument, PopulatedDoc } from 'mongoose';

import { db_transaction } from 'src/db.ts';

import { AppError } from 'src/error_utils.ts';

import type { UserDocument } from 'src/schema/core/User/UserModel.ts';

import type { LangSuffixedKeyUnion } from 'src/schema/lang_utils.ts';

import {
  create_dataloader_for_resource_by_primary_key_attr,
  create_dataloader_for_resources_by_foreign_key_attr,
} from 'src/schema/loader_utils.ts';

import { with_uniqueness_validation_plugin } from 'src/schema/mongoose_schema_utils/plugin.ts';
import {
  string_type_schema_def_mixin,
  number_type_schema_def_mixin,
  boolean_type_schema_def_mixin,
  created_at_schema_def,
  is_required_schema_def_mixin,
  make_lang_suffixed_schema_defs,
  make_foreign_id_ref_schema_def,
  make_foreign_key_schema_def,
} from 'src/schema/mongoose_schema_utils/schema_def.ts';
import { make_validation_mixin } from 'src/schema/mongoose_schema_utils/validation_utils.ts';
import {
  make_string_min_length_validator,
  make_string_max_length_validator,
} from 'src/schema/mongoose_schema_utils/validators.ts';

interface ConditionInterface {
  recordset_key: string;
  condition_type: string; // TODO this will be an enum once condition types are formalized
  parameters?: string[];
}
const ConditionSchema = new Schema<ConditionInterface>({
  condition_type: {
    ...string_type_schema_def_mixin,
    ...is_required_schema_def_mixin,
    // TODO validation
    immutable: true,
  },
  parameters: [
    {
      ...string_type_schema_def_mixin,
      // TODO validation
      immutable: true,
    },
  ],
});
export const ConditionModel = model('Condition', ConditionSchema);
export type ConditionDocument = HydratedDocument<ConditionInterface>;

interface ColumnDefInterface
  extends Record<LangSuffixedKeyUnion<`name`>, string>,
    Record<LangSuffixedKeyUnion<`description`>, string> {
  recordset_key: string;
  header: string;
  data_type: string; // TODO this will be an enum once column types are formalized
  conditions: PopulatedDoc<ConditionDocument>[];
}
const ColumnDefSchema = new Schema<ColumnDefInterface>({
  recordset_key: make_foreign_key_schema_def('Collection', String, {
    make_immutable: true,
    make_index: true,
  }),
  header: {
    ...string_type_schema_def_mixin,
    ...is_required_schema_def_mixin,
    ...make_validation_mixin<string, ColumnDefInterface>(
      make_string_min_length_validator(1),
      make_string_max_length_validator(150),
    ),
    ...make_lang_suffixed_schema_defs('name', {
      ...string_type_schema_def_mixin,
      ...is_required_schema_def_mixin,
      ...make_validation_mixin(
        make_string_min_length_validator(4),
        make_string_max_length_validator(150),
      ),
      immutable: true,
    }),
    ...make_lang_suffixed_schema_defs('description', {
      ...string_type_schema_def_mixin,
      ...is_required_schema_def_mixin,
      ...make_validation_mixin(
        make_string_min_length_validator(4),
        make_string_max_length_validator(3000),
      ),
      immutable: true,
    }),
    immutable: true,
  },
  data_type: {
    ...string_type_schema_def_mixin,
    ...is_required_schema_def_mixin,
    // TODO validation
    immutable: true,
  },
  conditions: [
    make_foreign_id_ref_schema_def('Condition', {
      make_immutable: true,
    }),
  ],
});
ColumnDefSchema.index({ recordset_key: 1, header: 1 }, { unique: true });
export const ColumnDefModel = model(
  'ColumnDef',
  with_uniqueness_validation_plugin(ColumnDefSchema),
);
export type ColumnDefDocument = HydratedDocument<ColumnDefInterface>;

export const ColumnDefByIdLoader =
  create_dataloader_for_resource_by_primary_key_attr(ColumnDefModel, '_id');
export const ColumnDefsByRecordsetKeyLoader =
  create_dataloader_for_resources_by_foreign_key_attr(
    ColumnDefModel,
    'recordset_key',
  );

export const ConditionByIdLoader =
  create_dataloader_for_resource_by_primary_key_attr(ConditionModel, '_id');

interface CollectionInterface
  extends Record<LangSuffixedKeyUnion<`name`>, string>,
    Record<LangSuffixedKeyUnion<`description`>, string> {
  stable_key: string;
  major_ver: number;
  minor_ver: number;
  is_current_version: boolean;
  created_by: PopulatedDoc<UserDocument>;
  created_at: number;
  is_locked: boolean;
  owners: PopulatedDoc<UserDocument>[];
  uploaders: PopulatedDoc<UserDocument>[];
  column_defs: PopulatedDoc<ColumnDefDocument>[];
  recordset_key: string;
}
const CollectionMongooseSchema = new Schema<CollectionInterface>({
  stable_key: {
    ...string_type_schema_def_mixin,
    ...is_required_schema_def_mixin,
    immutable: true,
    index: true,
  },
  major_ver: {
    ...number_type_schema_def_mixin,
    ...is_required_schema_def_mixin,
    immutable: true,
    min: 1,
  },
  minor_ver: {
    ...number_type_schema_def_mixin,
    ...is_required_schema_def_mixin,
    immutable: true,
    min: 0,
  },
  recordset_key: {
    ...string_type_schema_def_mixin,
    immutable: true,
    default: function () {
      return `${this.stable_key}_${this.major_ver}`;
    },
  },

  is_current_version: { ...boolean_type_schema_def_mixin, required: true },
  created_by: make_foreign_id_ref_schema_def('User', {
    make_immutable: true,
  }),
  created_at: created_at_schema_def,

  is_locked: {
    ...boolean_type_schema_def_mixin,
    ...is_required_schema_def_mixin,
    immutable: true,
  },
  ...make_lang_suffixed_schema_defs('name', {
    ...string_type_schema_def_mixin,
    ...is_required_schema_def_mixin,
    ...make_validation_mixin(
      make_string_min_length_validator(4),
      make_string_max_length_validator(150),
    ),
    immutable: true,
  }),
  ...make_lang_suffixed_schema_defs('description', {
    ...string_type_schema_def_mixin,
    ...is_required_schema_def_mixin,
    ...make_validation_mixin(
      make_string_min_length_validator(4),
      make_string_max_length_validator(3000),
    ),
    immutable: true,
  }),
  owners: [
    make_foreign_id_ref_schema_def('User', {
      make_immutable: true,
    }),
  ],
  uploaders: [make_foreign_id_ref_schema_def('User', { make_immutable: true })],
});
CollectionMongooseSchema.index(
  { stable_key: 1, major_ver: 1, minor_ver: 1 },
  { unique: true },
);
CollectionMongooseSchema.index({
  is_current_version: 1,
  owners: 1,
});
CollectionMongooseSchema.index({
  is_current_version: 1,
  uploaders: 1,
});
export const CollectionModel = model(
  'Collection',
  with_uniqueness_validation_plugin(CollectionMongooseSchema),
);
export type CollectionDocument = HydratedDocument<CollectionInterface>;

export const CollectionByIdLoader =
  create_dataloader_for_resource_by_primary_key_attr(CollectionModel, '_id');
export const CollectionByRecordsetKeyLoader =
  create_dataloader_for_resource_by_primary_key_attr(
    CollectionModel,
    'recordset_key',
  );
export const CurrentCollectionsByOwnersLoader =
  create_dataloader_for_resources_by_foreign_key_attr(
    CollectionModel,
    'owners',
    {
      constraints: { is_current_version: true },
    },
  );
export const CurrentCollectionsByUploadersLoader =
  create_dataloader_for_resources_by_foreign_key_attr(
    CollectionModel,
    'uploaders',
    { constraints: { is_current_version: true } },
  );
export const AllCollectionVersionsByStableKeyLoader =
  create_dataloader_for_resources_by_foreign_key_attr(
    CollectionModel,
    'stable_key',
  );

export interface RecordInterface {
  recordset_key: string;
  data: Record<string, any>;
  created_by: PopulatedDoc<UserDocument>;
  created_at: number;
}
const RecordMongooseSchema = new Schema<RecordInterface>({
  recordset_key: make_foreign_key_schema_def('Collection', String, {
    make_immutable: true,
    make_index: true,
  }),
  data: Schema.Types.Mixed,
  created_by: make_foreign_id_ref_schema_def('User', {
    make_immutable: true,
  }),
  created_at: created_at_schema_def,
});
RecordMongooseSchema.index({ recordset_key: 1, created_by: 1 });
export const RecordModel = model(
  'Record',
  with_uniqueness_validation_plugin(RecordMongooseSchema),
);
export type RecordDocument = HydratedDocument<RecordInterface>;

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
  recordset_key: string,
  new_column_defs: ColumnDefInterface[],
) => {
  const records = await RecordsByRecordsetKeyLoader.load(recordset_key);

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
    current_collection.is_current_version = false;
    await current_collection.save({ session });

    const [new_collection_version] = await CollectionModel.create(
      [
        {
          stable_key: current_collection.stable_key,
          major_ver: new_major_ver,
          minor_ver: new_minor_ver,
          is_current_version: true,
          created_by,

          collection_def: collection_def || current_collection.collection_def,
          column_defs: column_defs || current_collection.column_defs,
        },
      ],
      { session },
    );

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
  column_def: ColumnDefInterface,
  is_new_column: boolean,
) => {
  const created_by = user._id;
  const new_column_def_with_meta = {
    ...column_def,
    created_by,
  };

  const current_column_defs = await ColumnDefByIdLoader.loadMany(
    current_collection.column_defs.map((object_id) => object_id.toString()),
  );

  // TODO check for... something, uh, I had the start of a conditional on _.any here before the weekend, but forgot what I was coding

  const new_column_defs = is_new_column
    ? [...current_column_defs, new_column_def_with_meta]
    : _.map(current_column_defs, (existing_column_def) =>
        existing_column_def.header !== new_column_def_with_meta.header
          ? existing_column_def
          : new_column_def_with_meta,
      );

  const is_update_a_breaking_change =
    await are_new_column_defs_compatible_with_current_records(
      current_collection.recordset_key,
      new_column_defs,
    );

  if (!is_update_a_breaking_change) {
    return create_collection_new_minor_version(
      current_collection,
      user,
      current_collection.collection_def,
      new_column_defs,
    );
  } else {
    return create_collection_new_major_version(
      current_collection,
      user,
      current_collection.collection_def,
      new_column_defs,
    );
  }
};

export const insert_records = async (
  collection: CollectionDocument,
  data: Record<string, any>[],
  user: UserDocument,
) => {
  if (
    !validate_record_data_against_column_defs(collection.recordset_key, data)
  ) {
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
