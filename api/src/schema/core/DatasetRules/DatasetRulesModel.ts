import { Schema, model, Types } from 'mongoose';
import type { Document } from 'mongoose';

import { create_dataloader_for_resource_by_primary_key_attr } from 'src/schema/loader_utils.ts';

interface DatasetRulesInterface extends Document<Types.ObjectId> {}
const DatasetMongooseSchema = new Schema<DatasetRulesInterface>({});
export const DatasetRulesModel = model<DatasetRulesInterface>(
  'DatasetRules',
  DatasetMongooseSchema,
);

export const DatasetRulesByIdLoader =
  create_dataloader_for_resource_by_primary_key_attr(DatasetRulesModel, '_id');
