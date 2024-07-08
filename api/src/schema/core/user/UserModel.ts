import { Schema, model } from 'mongoose';
import type { Document } from 'mongoose';

import { create_dataloader_for_resource_by_primary_key } from 'src/schema/loader_utils.ts';
import { pkey_type } from 'src/schema/mongoose_utils.ts';

interface UserInterface extends Document {
  email: string;
  created_at: number;
  last_login_at?: number;
}
const UserMongooseSchema = new Schema<UserInterface>({
  email: pkey_type,
  created_at: { type: Number, required: true },
  last_login_at: { type: Number, required: false },
});
export const UserModel = model<UserInterface>('User', UserMongooseSchema);

export const UserByEmailLoader = create_dataloader_for_resource_by_primary_key(
  UserModel,
  'email',
  true,
);

export const get_or_create_user = async (email: string) => {
  const login_time = Date.now();

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    existingUser.last_login_at = login_time;
    return existingUser.save();
  } else {
    return UserModel.create({
      email,
      created_at: login_time,
      last_login_at: login_time,
    });
  }
};
