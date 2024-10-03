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

export interface CollectionDataInterface
  extends Record<LangSuffixedKeyUnion<`name`>, string>,
    Record<LangSuffixedKeyUnion<`description`>, string> {
  is_locked: boolean;
  owners: Types.ObjectId[];
  uploaders: Types.ObjectId[];
}
export interface CollectionMetaInterface {
  stable_key: string;
  major_ver: number;
  minor_ver: number;
  recordset_key: string;
  is_current_version: boolean;
  created_by: Types.ObjectId;
  created_at: number;
}
export interface CollectionInterface {
  meta: CollectionMetaInterface;
  data: CollectionDataInterface;
}
const CollectionSchema = new Schema<CollectionInterface>({
  meta: {
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
      min: 0,
    },
    minor_ver: {
      ...number_type_schema_def_mixin,
      ...is_required_schema_def_mixin,
      immutable: true,
      min: 0,
    },
    is_current_version: { ...boolean_type_schema_def_mixin, required: true },
    created_by: make_foreign_id_ref_schema_def('User', {
      make_immutable: true,
    }),

    created_at: created_at_schema_def,
    recordset_key: {
      ...string_type_schema_def_mixin,
      immutable: true,
      default: function () {
        return `${this.meta.stable_key}_${this.meta.major_ver}`;
      },
    },
  },

  data: {
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
    uploaders: [
      make_foreign_id_ref_schema_def('User', { make_immutable: true }),
    ],
  },
});
CollectionSchema.index(
  { 'meta.stable_key': 1, 'meta.major_ver': 1, 'meta.minor_ver': 1 },
  { unique: true },
);
CollectionSchema.index({
  'meta.is_current_version': 1,
  'data.owners': 1,
});
CollectionSchema.index({
  'meta.is_current_version': 1,
  'data.uploaders': 1,
});
export const CollectionModel = model(
  'Collection',
  with_uniqueness_validation_plugin(CollectionSchema),
);
export type CollectionDocument = HydratedDocument<CollectionInterface>;
export const CollectionByIdLoader =
  create_dataloader_for_resource_by_primary_key_attr(CollectionModel, '_id');
export const CurrentCollectionByRecordsetKeyLoader =
  create_dataloader_for_resource_by_primary_key_attr(
    CollectionModel,
    'meta.recordset_key',
    { constraints: { 'meta.is_current_version': true } },
  );
export const CurrentCollectionsByOwnersLoader =
  create_dataloader_for_resources_by_foreign_key_attr(
    CollectionModel,
    'data.owners',
    {
      constraints: { 'meta.is_current_version': true },
    },
  );
export const CurrentCollectionsByUploadersLoader =
  create_dataloader_for_resources_by_foreign_key_attr(
    CollectionModel,
    'data.uploaders',
    { constraints: { 'meta.is_current_version': true } },
  );
export const AllCollectionVersionsByStableKeyLoader =
  create_dataloader_for_resources_by_foreign_key_attr(
    CollectionModel,
    'stable_key',
  );

export interface ConditionInterface {
  condition_type: string; // TODO this will be an enum once condition types are formalized
  parameters?: string[];
}
export interface ColumnDefDataInterface
  extends Record<LangSuffixedKeyUnion<`name`>, string>,
    Record<LangSuffixedKeyUnion<`description`>, string> {
  header: string;
  data_type: string; // TODO this will be an enum once column types are formalized
  conditions: ConditionInterface[];
}
export interface ColumnDefMetaInterface {
  recordset_key: string;
}
export interface ColumnDefInterface {
  data: ColumnDefDataInterface;
  meta: ColumnDefMetaInterface;
}
const ColumnDefSchema = new Schema<ColumnDefInterface>({
  meta: {
    recordset_key: make_foreign_key_schema_def('Collection', String, {
      make_immutable: true,
      make_index: true,
    }),
  },

  data: {
    header: {
      ...string_type_schema_def_mixin,
      ...is_required_schema_def_mixin,
      ...make_validation_mixin<string, ColumnDefInterface>(
        make_string_min_length_validator(1),
        make_string_max_length_validator(150),
      ),
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
    data_type: {
      ...string_type_schema_def_mixin,
      ...is_required_schema_def_mixin,
      // TODO validation
      immutable: true,
    },
    conditions: [
      {
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
      },
    ],
  },
});
ColumnDefSchema.index(
  { 'meta.recordset_key': 1, 'data.header': 1 },
  { unique: true },
);
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
    'meta.recordset_key',
  );

export interface RecordInterface {
  meta: {
    recordset_key: string;
    created_by: Types.ObjectId;
    created_at: number;
  };

  data: Record<string, any>;
}
const RecordMongooseSchema = new Schema<RecordInterface>({
  meta: {
    recordset_key: make_foreign_key_schema_def('Collection', String, {
      make_immutable: true,
      make_index: true,
    }),
    created_by: make_foreign_id_ref_schema_def('User', {
      make_immutable: true,
    }),
    created_at: created_at_schema_def,
  },

  data: Schema.Types.Mixed,
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
    'meta.recordset_key',
  );
export const make_records_created_by_user_loader_with_recordset_constraint =
  _.memoize((recordset_key: string) =>
    create_dataloader_for_resources_by_foreign_key_attr(
      RecordModel,
      'meta.created_by',
      {
        constraints: {
          'meta.recordset_key': recordset_key,
        },
      },
    ),
  );

type RecordDataValidation = Record<string, string>[];
export function validate_record_data_against_column_defs<
  Options extends { verbose: boolean },
>(
  column_defs_data: ColumnDefDataInterface[],
  record_data: Record<string, any>[], // TODO, could better type data records
  options?: Options,
): Options extends { verbose: true } ? RecordDataValidation : boolean;
export function validate_record_data_against_column_defs(
  _column_defs_data: ColumnDefDataInterface[],
  record_data: Record<string, any>[],
  options = { verbose: false },
): RecordDataValidation | boolean {
  // TODO, column def details (data types and constraints) and their validation will be a follow up PR

  if (options.verbose) {
    return _.map(record_data, undefined);
  } else {
    return true;
  }
}

export const are_new_column_defs_compatible_with_current_records = async (
  recordset_key: string,
  column_defs_data: ColumnDefDataInterface[],
) => {
  const records = await RecordsByRecordsetKeyLoader.load(recordset_key);

  return validate_record_data_against_column_defs(
    column_defs_data,
    _.map(records, 'data'),
  );
};

const get_unused_collection_stable_key = async () => {
  // randomUUID uses an entropy cache by default, improves performance but loses entropy after 128 UUIDs.
  // The check against the database means we can ignore the entropy loss, most likely, but if this becomes
  // a problem then use `randomUUID({ disableEntropyCache: true })`
  const new_stable_key = randomUUID();

  const collection_already_using_stable_key = await CollectionModel.findOne({
    'meta.stable_key': new_stable_key,
  });
  if (collection_already_using_stable_key === null) {
    return new_stable_key;
  } else {
    return get_unused_collection_stable_key();
  }
};
export const create_collection = (
  user: UserDocument,
  collection_data: CollectionDataInterface,
  column_defs_data: ColumnDefDataInterface[],
) => {
  return db_transaction(async (session) => {
    const new_stable_key = await get_unused_collection_stable_key();

    const [new_collection] = await CollectionModel.create(
      [
        {
          meta: {
            stable_key: new_stable_key,
            major_ver: 0,
            minor_ver: 0,
            is_current_version: true,
            created_by: user._id,
          },

          data: collection_data,
        },
      ],
      { session },
    );

    if (column_defs_data.length > 0) {
      await ColumnDefModel.create(
        column_defs_data.map((column_def_data) => ({
          data: column_def_data,
          meta: { recordset_key: new_collection.meta.recordset_key },
        })),
        { session },
      );
    }

    return new_collection;
  });
};

export const update_collection_def = async (
  user: UserDocument,
  collection_doc: CollectionDocument,
  updated_collection_data: CollectionDataInterface,
) => {
  return db_transaction(async (session) => {
    collection_doc.meta.is_current_version = false;
    await collection_doc.save({ session });

    const [new_collection_doc] = await CollectionModel.create(
      [
        {
          meta: {
            stable_key: collection_doc.meta.stable_key,
            major_ver: collection_doc.meta.major_ver,
            minor_ver: collection_doc.meta.minor_ver + 1,
            is_current_version: true,
            created_by: user._id,
          },

          data: updated_collection_data,
        },
      ],
      { session },
    );

    return new_collection_doc;
  });
};

export const create_column_defs_on_collection = async (
  user: UserDocument,
  collection_doc: CollectionDocument,
  incoming_column_defs_data: ColumnDefDataInterface[],
) => {
  return db_transaction(async (session) => {
    collection_doc.meta.is_current_version = false;
    await collection_doc.save({ session });

    const [new_collection_doc] = await CollectionModel.create(
      [
        {
          meta: {
            stable_key: collection_doc.meta.stable_key,
            major_ver: collection_doc.meta.major_ver + 1,
            minor_ver: 0,
            is_current_version: true,
            created_by: user._id,
          },

          data: collection_doc.data,
        },
      ],
      { session },
    );

    const existing_column_defs = await ColumnDefsByRecordsetKeyLoader.load(
      collection_doc.meta.recordset_key,
    );

    await ColumnDefModel.create(
      _.chain(existing_column_defs)
        .map((column_def) => column_def.data)
        .concat(incoming_column_defs_data)
        .map((column_def_data) => ({
          data: column_def_data,
          meta: { recordset_key: new_collection_doc.meta.recordset_key },
        }))
        .value(),
      { session },
    );

    return new_collection_doc;
  });
};

export const remove_column_def_from_collection = async (
  user: UserDocument,
  collection_doc: CollectionDocument,
  column_id: Types.ObjectId,
) => {
  return db_transaction(async (session) => {
    collection_doc.meta.is_current_version = false;
    await collection_doc.save({ session });

    const [new_collection_doc] = await CollectionModel.create(
      [
        {
          meta: {
            stable_key: collection_doc.meta.stable_key,
            major_ver: collection_doc.meta.major_ver + 1,
            minor_ver: 0,
            is_current_version: true,
            created_by: user._id,
          },

          data: collection_doc.data,
        },
      ],
      { session },
    );

    const existing_column_defs = await ColumnDefsByRecordsetKeyLoader.load(
      collection_doc.meta.recordset_key,
    );

    await ColumnDefModel.create(
      _.chain(existing_column_defs)
        .filter((column_def) => column_def._id !== column_id)
        .map((column_def) => ({
          data: column_def.data,
          meta: { recordset_key: new_collection_doc.meta.recordset_key },
        }))
        .value(),
      { session },
    );

    return new_collection_doc;
  });
};

// Column definition updates _may_ result in a major version bump if compatibility breaks, minor version otherwise
export const update_column_def_on_collection = async (
  user: UserDocument,
  collection_doc: CollectionDocument,
  column_id: Types.ObjectId | string,
  updated_column_def_data: ColumnDefDataInterface,
) => {
  const current_column_defs = await ColumnDefsByRecordsetKeyLoader.load(
    collection_doc.meta.recordset_key,
  );

  const new_column_defs_data = _.map(
    current_column_defs,
    (current_column_def) =>
      current_column_def._id.equals(column_id)
        ? updated_column_def_data
        : current_column_def.data,
  );
  const is_update_a_breaking_change =
    await are_new_column_defs_compatible_with_current_records(
      collection_doc.meta.recordset_key,
      new_column_defs_data,
    );

  return db_transaction(async (session) => {
    collection_doc.meta.is_current_version = false;
    await collection_doc.save({ session });

    const [new_collection_doc] = await CollectionModel.create(
      [
        {
          meta: {
            stable_key: collection_doc.meta.stable_key,
            ...(is_update_a_breaking_change
              ? {
                  major_ver: collection_doc.meta.major_ver + 1,
                  minor_ver: 0,
                }
              : {
                  major_ver: collection_doc.meta.major_ver,
                  minor_ver: collection_doc.meta.minor_ver + 1,
                }),
            is_current_version: true,
            created_by: user._id,
          },

          data: collection_doc.data,
        },
      ],
      { session },
    );

    await ColumnDefModel.create(
      new_column_defs_data.map((column_def_data) => ({
        data: column_def_data,
        meta: {
          recordset_key: new_collection_doc.meta.recordset_key,
        },
      })),
      { session },
    );

    return new_collection_doc;
  });
};

export const insert_records = async (
  user: UserDocument,
  collection_doc: CollectionDocument,
  record_data: Record<string, any>[],
) => {
  const column_defs = await ColumnDefsByRecordsetKeyLoader.load(
    collection_doc.meta.recordset_key,
  );

  if (
    !validate_record_data_against_column_defs(
      column_defs.map((column_defs) => column_defs.data),
      record_data,
    )
  ) {
    throw new AppError(400, 'Record validation failed');
  }

  // providing creation timestamp rather than leaving to default setter, to give
  // records created as a single transaction a consistent time stamp
  const created_at = Date.now();

  const record_documents = record_data.map((data) => ({
    data,
    meta: {
      recordset_key: collection_doc.meta.recordset_key,
      created_by: user._id,
      created_at,
    },
  }));

  return await RecordModel.insertMany(record_documents);
};

export const delete_records = async (record_ids: Types.ObjectId[]) =>
  await RecordModel.deleteMany({
    _id: { $in: record_ids },
  });
