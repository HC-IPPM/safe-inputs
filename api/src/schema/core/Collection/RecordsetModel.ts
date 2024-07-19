import { Schema, model, Types } from 'mongoose';
import type { HydratedDocument } from 'mongoose';

import type { SetOptional } from 'type-fest';

import type { UserDocument } from 'src/schema/core/User/UserModel.ts';
import type { LangSuffixedKeyUnion } from 'src/schema/lang_utils.ts';
import { create_dataloader_for_resource_by_primary_key_attr } from 'src/schema/loader_utils.ts';
import {
  make_foreign_id_type,
  make_lang_suffixed_type,
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

export interface RecordInterface {
  data: Record<string, any>;
  created_by: Types.ObjectId;
  created_at: number;
}
const RecordSchema = new Schema<RecordInterface>({
  data: Schema.Types.Mixed,
  created_by: make_foreign_id_type('User', { required: true }),
  created_at: { type: Number, required: true },
});

interface RecordsetInterface {
  column_defs: ColumnDefInterface[];
  records: RecordInterface[];
}
const RecordsetMongooseSchema = new Schema<RecordsetInterface>({
  column_defs: [ColumnDefSchema],
  records: [RecordSchema],
});

export const RecordsetModel = model<RecordsetInterface>(
  'Recordset',
  RecordsetMongooseSchema,
);
export type RecordsetDocument = HydratedDocument<RecordsetInterface>;

export const RecordsetByIdLoader =
  create_dataloader_for_resource_by_primary_key_attr(RecordsetModel, '_id');

type ColumnDefWithoutMeta = SetOptional<
  ColumnDefInterface,
  'created_by' | 'created_at'
>;

export const create_new_recordset = (
  column_defs: ColumnDefWithoutMeta,
  user: UserDocument,
) => {}; // TODO

export const are_new_column_defs_compatible_with_current_recordset = (
  recordset: RecordsetDocument,
  new_column_defs: ColumnDefWithoutMeta,
) => {}; // TODO

export const update_column_defs_on_recordset = (
  recordset: RecordsetDocument,
  new_column_defs: ColumnDefWithoutMeta,
  user: UserDocument,
) => {}; // TODO

export const delete_records_in_recordset = (
  recordset: RecordsetDocument,
  record_ids: Types.ObjectId[],
) => {}; // TODO

export const validate_new_records_against_recordset_column_defs = (
  recordset: RecordsetDocument,
  data: Record<string, any>[],
) => {}; // TODO

export const insert_records_in_recordset = (
  recordset: RecordsetDocument,
  data: Record<string, any>[],
  user: UserDocument,
) => {};
