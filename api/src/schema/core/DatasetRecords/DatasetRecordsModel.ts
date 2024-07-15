import { Schema, model, Types } from 'mongoose';
import type { Document } from 'mongoose';

import { create_dataloader_for_resource_by_primary_key_attr } from 'src/schema/loader_utils.ts';

import {
  make_foreign_id_type,
  make_foreign_key_type,
} from 'src/schema/mongoose_utils.ts';

interface DatasetRecordsInterface extends Document<Types.ObjectId> {
  dataset_stable_key: string;
  rules: Types.ObjectId;
  data: any[];
}
const DatasetMongooseSchema = new Schema<DatasetRecordsInterface>({
  dataset_stable_key: make_foreign_key_type('Dataset', {
    required: true,
  }),
  rules: make_foreign_id_type('DatasetRules', {
    required: true,
  }),
  data: [Schema.Types.Mixed],
});
DatasetMongooseSchema.index(
  { dataset_stable_id: 1, rules: 1 },
  { unique: true },
);

export const DatasetRecordsModel = model<DatasetRecordsInterface>(
  'DatasetRecords',
  DatasetMongooseSchema,
);

export const DatasetRecordsByIdLoader =
  create_dataloader_for_resource_by_primary_key_attr(
    DatasetRecordsModel,
    '_id',
  );
