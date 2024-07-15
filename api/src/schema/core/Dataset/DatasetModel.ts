import { Schema, model, Types } from 'mongoose';
import type { Document } from 'mongoose';

import type { LangSuffixedKeyUnion } from 'src/schema/lang_utils.ts';
import {
  create_dataloader_for_resource_by_primary_key_attr,
  create_dataloader_for_resources_by_foreign_key_attr,
} from 'src/schema/loader_utils.ts';
import { make_lang_suffixed_type } from 'src/schema/mongoose_utils.ts';

interface DatasetInterface
  extends Document,
    Record<LangSuffixedKeyUnion<`name`>, string>,
    Record<LangSuffixedKeyUnion<`description`>, string> {
  _id: Types.ObjectId;
  owners: Types.ObjectId[];
  uploaders?: Types.ObjectId[];
  is_active: boolean;
  created_by: Types.ObjectId;
  created_at: number;
  is_current: boolean;
  previous_version?: Types.ObjectId;
}
const DatasetMongooseSchema = new Schema<DatasetInterface>({
  ...make_lang_suffixed_type('name', { type: String, required: true }),
  ...make_lang_suffixed_type('description', { type: String, required: true }),
  owners: [{ type: Schema.ObjectId, ref: 'User', required: true }],
  uploaders: [{ type: Schema.ObjectId, ref: 'User' }],
  is_active: { type: Boolean, required: true },
  created_at: { type: Number, required: true },
  is_current: { type: Boolean, required: true },
  previous_version: { type: Schema.ObjectId, ref: 'Dataset' },
});
DatasetMongooseSchema.index({ is_current: 1, owners: 1 });
DatasetMongooseSchema.index({ is_current: 1, uploaders: 1 });
export const DatasetModel = model<DatasetInterface>(
  'Dataset',
  DatasetMongooseSchema,
);

export const DatasetByIdLoader =
  create_dataloader_for_resource_by_primary_key_attr(DatasetModel, '_id');

export const CurrentDatasetsByOwnersLoader =
  create_dataloader_for_resources_by_foreign_key_attr(DatasetModel, 'owners', {
    constraints: { is_current: true },
  });

export const CurrentDatasetsByUploadersLoader =
  create_dataloader_for_resources_by_foreign_key_attr(
    DatasetModel,
    'uploaders',
    { constraints: { is_current: true } },
  );
