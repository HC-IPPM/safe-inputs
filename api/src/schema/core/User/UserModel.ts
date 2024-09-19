import _ from 'lodash';
import { HydratedDocument, Schema, model } from 'mongoose';

import validator from 'validator';

import { user_email_allowed_rule, check_authz_rules } from 'src/authz.ts';

import { AppError } from 'src/error_utils.ts';
import { create_dataloader_for_resource_by_primary_key_attr } from 'src/schema/loader_utils.ts';
import {
  primary_key_type,
  number_type_mixin,
  is_required_mixin,
  make_validation_mixin,
} from 'src/schema/mongoose_utils.ts';

interface UserInterface {
  email: string;
  created_at: number;
  second_last_login_at?: number;
  last_login_at?: number;
}
const UserMongooseSchema = new Schema<UserInterface>({
  email: {
    ...primary_key_type,
    ...make_validation_mixin<string>((value) =>
      !validator.isEmail(value)
        ? { en: `"${value}" is not a valid email`, fr: 'TODO' }
        : undefined,
    ),
  },
  created_at: {
    ...number_type_mixin,
    ...is_required_mixin,
    immutable: true,
  },
  second_last_login_at: { ...number_type_mixin, required: false },
  last_login_at: { ...number_type_mixin, required: false },
});

export const UserModel = model<UserInterface>('User', UserMongooseSchema);
export type UserDocument = HydratedDocument<UserInterface>;

export const UserByIdLoader =
  create_dataloader_for_resource_by_primary_key_attr(UserModel, '_id');

export const UserByEmailLoader =
  create_dataloader_for_resource_by_primary_key_attr(UserModel, 'email');

export const get_or_create_users = async (
  emails: string[],
): Promise<UserDocument[]> => {
  const possible_users = await UserByEmailLoader.loadMany(emails);

  const possible_users_by_email = _.chain(emails)
    .zip(possible_users)
    .fromPairs()
    .value();

  const emails_without_users = _.chain(possible_users_by_email)
    .omitBy((user) => _.isString(user?.email))
    .keys()
    .value();

  const disallowed_emails = _.filter(
    emails_without_users,
    (email) => !check_authz_rules({ email }, user_email_allowed_rule),
  );
  if (!_.isEmpty(disallowed_emails)) {
    throw new AppError(
      400,
      `Provided emails not allowed: [${disallowed_emails.join(', ')}]`,
    );
  }

  const created_at = Date.now();
  const new_users = await UserModel.create(
    emails_without_users.map((email) => ({
      email,
      created_at,
    })),
  );

  const new_users_by_email = _.chain(new_users)
    .map((user) => [user.email, user])
    .fromPairs()
    .value();

  const users_by_email = { ...possible_users_by_email, ...new_users_by_email };

  return _.map(emails, (email) => users_by_email[email]);
};

export const get_or_create_user = async (email: string) => {
  const users = await get_or_create_users([email]);
  return users[0];
};

export const update_user_last_login_times = async (email: string) => {
  const user = await UserModel.findOne({ email });

  if (user === null) {
    throw new AppError(500, `No user found with email "${email}"`);
  } else {
    user.second_last_login_at = user.last_login_at;
    user.last_login_at = Date.now();
    return user.save();
  }
};
