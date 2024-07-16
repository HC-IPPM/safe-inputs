import { Schema, model, Types } from 'mongoose';
import type { Document } from 'mongoose';

import type { LangSuffixedKeyUnion } from 'src/schema/lang_utils.ts';
import {
  create_dataloader_for_resource_by_primary_key_attr,
  create_dataloader_for_resources_by_foreign_key_attr,
} from 'src/schema/loader_utils.ts';
import {
  make_lang_suffixed_type,
  make_foreign_id_type,
} from 'src/schema/mongoose_utils.ts';

interface CollectionInterface
  extends Document<Types.ObjectId>,
    Record<LangSuffixedKeyUnion<`name`>, string>,
    Record<LangSuffixedKeyUnion<`description`>, string> {
  stable_key: string;
  sem_ver: string;
  is_current: boolean;
  previous_version?: Types.ObjectId;
  created_by: Types.ObjectId;
  created_at: number;
  is_locked: boolean;
  owners: Types.ObjectId[];
  uploaders?: Types.ObjectId[];
  recordset: Types.ObjectId;
}
const CollectionMongooseSchema = new Schema<CollectionInterface>({
  ...make_lang_suffixed_type('name', { type: String, required: true }),
  ...make_lang_suffixed_type('description', { type: String, required: true }),
  stable_key: { type: String, index: true },
  sem_ver: { type: String, required: true },
  is_current: { type: Boolean, required: true },
  previous_version: { type: Schema.ObjectId, ref: 'Collection' },
  created_by: make_foreign_id_type('User', { required: true }),
  created_at: { type: Number, required: true },
  is_locked: { type: Boolean, required: true },
  owners: [make_foreign_id_type('User', { required: true })],
  uploaders: [make_foreign_id_type('User')],
  recordset: { type: Schema.ObjectId, ref: 'Recordset' },
});
CollectionMongooseSchema.index({ is_current: 1, owners: 1 });
CollectionMongooseSchema.index({ is_current: 1, uploaders: 1 });

export const CollectionModel = model<CollectionInterface>(
  'Collection',
  CollectionMongooseSchema,
);

export const CollectionByIdLoader =
  create_dataloader_for_resource_by_primary_key_attr(CollectionModel, '_id');

export const CurrentCollectionsByOwnersLoader =
  create_dataloader_for_resources_by_foreign_key_attr(
    CollectionModel,
    'owners',
    {
      constraints: { is_current: true },
    },
  );

export const CurrentCollectionsByUploadersLoader =
  create_dataloader_for_resources_by_foreign_key_attr(
    CollectionModel,
    'uploaders',
    { constraints: { is_current: true } },
  );

// TODO: make sure required and derived fields have values, corresponding init rules and records documents
export const create_new_collection = () => {};

// TODO: create a new entry, populate it's previous_version referece, and set is_current: false on the old instance. If rules have changed,
// create new init records document? Assuming that, initially, we won't be able to write too many smarts around breaking change detection/
// data migration, will have to ask users to modify the old data offline to work with the new rules and then seed it in to the new instance
export const update_collection = () => {};

export const user_is_owner_of_collection = () => {}; // TODO

export const user_is_uploader_for_collection = () => {}; // TODO
