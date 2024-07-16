import { Schema, model, Types } from 'mongoose';
import type { Document } from 'mongoose';

import { create_dataloader_for_resource_by_primary_key_attr } from 'src/schema/loader_utils.ts';
import { make_foreign_id_type } from 'src/schema/mongoose_utils.ts';

interface RecordInterface extends Document<Types.ObjectId> {
  data: Record<string, any>;
  created_by: Types.ObjectId;
  created_at: number;
}
const RecordSchema = new Schema<RecordInterface>({
  data: Schema.Types.Mixed,
  created_by: make_foreign_id_type('User', { required: true }),
  created_at: { type: Number, required: true },
});

interface DatasetRecordsInterface extends Document<Types.ObjectId> {
  records: RecordInterface[];
}
const DatasetRecordsMongooseSchema = new Schema<DatasetRecordsInterface>({
  records: [RecordSchema],
});

export const DatasetRecordsModel = model<DatasetRecordsInterface>(
  'DatasetRecords',
  DatasetRecordsMongooseSchema,
);

export const DatasetRecordsByIdLoader =
  create_dataloader_for_resource_by_primary_key_attr(
    DatasetRecordsModel,
    '_id',
  );
