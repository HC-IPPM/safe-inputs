import { Schema, model, Types } from 'mongoose';
import type { HydratedDocument } from 'mongoose';

import {
  create_dataloader_for_resource_by_primary_key_attr,
  create_dataloader_for_resources_by_foreign_key_attr,
} from 'src/schema/loader_utils.ts';
import {
  make_foreign_key_type,
  make_foreign_id_type,
} from 'src/schema/mongoose_utils.ts';

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
