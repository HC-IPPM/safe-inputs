import { GraphQLError } from 'graphql';
import { GraphQLAccountNumber } from 'graphql-scalars';
import { Schema, model, Types } from 'mongoose';
import type { HydratedDocument } from 'mongoose';

import type { SetOptional } from 'type-fest';

import type { UserDocument } from 'src/schema/core/User/UserModel.ts';
import type { LangSuffixedKeyUnion } from 'src/schema/lang_utils.ts';
import {
  create_dataloader_for_resource_by_primary_key_attr,
  create_dataloader_for_resources_by_foreign_key_attr,
} from 'src/schema/loader_utils.ts';
import {
  make_lang_suffixed_type,
  make_foreign_id_type,
  make_foreign_key_type,
} from 'src/schema/mongoose_utils.ts';

interface ConditionInterface {
  condition_type: string; // TODO this will be an enum once condition types are formalized
  parameters?: string[];
}
const ConditionSchema = new Schema<ConditionInterface>({
  condition_type: { type: String, required: true },
  parameters: [{ type: String }],
});

interface ColumnDefInterface
  extends Record<LangSuffixedKeyUnion<`name`>, string>,
    Record<LangSuffixedKeyUnion<`description`>, string> {
  header: string;
  data_type: string; // TODO this will be an enum once column types are formalized
  conditions: ConditionInterface[];
  created_by: Types.ObjectId;
  created_at: number;
}
const ColumnDefSchema = new Schema<ColumnDefInterface>({
  ...make_lang_suffixed_type('name', { type: String, required: true }),
  ...make_lang_suffixed_type('description', { type: String, required: true }),
  header: { type: String, required: true },
  data_type: { type: String, required: true },
  conditions: [ConditionSchema],
});

interface CollectionDefInterface
  extends Record<LangSuffixedKeyUnion<`name`>, string>,
    Record<LangSuffixedKeyUnion<`description`>, string> {
  owners: Types.ObjectId[];
  uploaders?: Types.ObjectId[];
  is_locked: boolean;
}
const CollectionDefSchema = new Schema<CollectionDefInterface>({
  ...make_lang_suffixed_type('name', { type: String, required: true }),
  ...make_lang_suffixed_type('description', { type: String, required: true }),
  owners: [make_foreign_id_type('User', { required: true })],
  uploaders: [make_foreign_id_type('User')],
  is_locked: { type: Boolean, required: true },
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
  stable_key: { type: String, index: true },
  major_ver: { type: Number, required: true },
  minor_ver: { type: Number, required: true },
  is_current_version: { type: Boolean, required: true },
  created_by: make_foreign_id_type('User', { required: true }),
  created_at: { type: Number, required: true },

  collection_def: CollectionDefSchema,

  column_defs: [ColumnDefSchema],

  recordset_key: {
    type: String,
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

export const CollectionModel = model<CollectionInterface>(
  'Collection',
  CollectionMongooseSchema,
);
export type CollectionDocument = HydratedDocument<CollectionInterface>;

export interface RecordInterface {
  recordset_key: string;
  data: Record<string, any>;
  created_by: Types.ObjectId;
  created_at: number;
}
const RecordMongooseSchema = new Schema<RecordInterface>({
  recordset_key: make_foreign_key_type(String, 'Collection', {
    required: true,
    index: true,
  }),
  data: Schema.Types.Mixed,
  created_by: make_foreign_id_type('User', { required: true }),
  created_at: { type: Number, required: true },
});
RecordMongooseSchema.index({ recordset_key: 1, created_by: 1 });

export const RecordModel = model<RecordInterface>(
  'Record',
  RecordMongooseSchema,
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
  create_dataloader_for_resource_by_primary_key_attr(
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

export const create_collection_init = () => {}; // TODO

const create_collection_new_minor_version = () => {}; // TODO

const create_collection_new_major_version = () => {}; // TODO

// updating collection definition fields always bumps minor versions
export const update_collection_def_fields = () => {}; // TODO

type ColumnDefWithoutMeta = SetOptional<
  ColumnDefInterface,
  'created_by' | 'created_at'
>;
export const are_new_column_defs_compatible_with_current_records = (
  collection: CollectionDocument,
  new_column_defs: ColumnDefWithoutMeta,
) => {}; // TODO

// Column definition updates _may_ result in a major version bump if compatibility breaks, minor version otherwise
export const update_column_defs_on_collection = () => {}; // TODO

// record management logic belongs to the collection, where the column defs live.
// Record updates don't change the collection sem ver
export const validate_new_records_against_column_defs = (
  collection: CollectionDocument,
  data: Record<string, any>[],
  options = { throw_on_invalid: false },
) => true; // TODO

export const insert_records = async (
  collection: CollectionDocument,
  data: Record<string, any>[],
  user: UserDocument,
) => {
  validate_new_records_against_column_defs(collection, data, {
    throw_on_invalid: true,
  });

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
