import { Schema, model, Types } from 'mongoose';
import type { Document } from 'mongoose';

import type { LangSuffixedKeyUnion } from 'src/schema/lang_utils.ts';
import { create_dataloader_for_resource_by_primary_key_attr } from 'src/schema/loader_utils.ts';
import {
  make_foreign_id_type,
  make_lang_suffixed_type,
} from 'src/schema/mongoose_utils.ts';

interface ConditionInterface extends Document<Types.ObjectId> {
  condition_type: string; // TODO this will be an enum once condition types are formalized
  parameters?: (string | number | boolean)[];
}
const ConditionSchema = new Schema<ConditionInterface>({
  condition_type: { type: String, required: true },
  parameters: [{ type: Schema.Types.Mixed }],
});

interface RuleInterface
  extends Document<Types.ObjectId>,
    Record<LangSuffixedKeyUnion<`name`>, string>,
    Record<LangSuffixedKeyUnion<`description`>, string> {
  target_header: string;
  column_type: string; // TODO this will be an enum once column types are formalized
  conditions: ConditionInterface[];
}
const RuleSchema = new Schema<RuleInterface>({
  ...make_lang_suffixed_type('name', { type: String, required: true }),
  ...make_lang_suffixed_type('description', { type: String, required: true }),
  target_header: { type: String, required: true },
  column_type: { type: String, required: true },
  conditions: [ConditionSchema],
});

interface DatasetRulesInterface extends Document<Types.ObjectId> {
  rules: Record<string, RuleInterface>;
  created_by: Types.ObjectId;
  created_at: number;
}
const DatasetRulesMongooseSchema = new Schema<DatasetRulesInterface>({
  rules: [RuleSchema],
  created_by: make_foreign_id_type('User', { required: true }),
  created_at: { type: Number, required: true },
});
export const DatasetRulesModel = model<DatasetRulesInterface>(
  'DatasetRules',
  DatasetRulesMongooseSchema,
);

export const DatasetRulesByIdLoader =
  create_dataloader_for_resource_by_primary_key_attr(DatasetRulesModel, '_id');
