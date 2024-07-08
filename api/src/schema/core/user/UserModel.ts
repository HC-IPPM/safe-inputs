import { Schema, model } from 'mongoose';
import type { Document } from 'mongoose';

import { create_dataloader_for_resource_by_primary_key } from 'src/schema/loader_utils.ts';
import { pkey_type } from 'src/schema/mongoose_utils.ts';

interface UserInterface extends Document {
  email: string;
}
const UserMongooseSchema = new Schema<UserInterface>({
  email: pkey_type,
});
export const UserModel = model<UserInterface>('User', UserMongooseSchema);

export const UserByEmailLoader = create_dataloader_for_resource_by_primary_key(
  UserModel,
  'email',
  true,
);
