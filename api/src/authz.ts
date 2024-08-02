import _ from 'lodash';
import validator from 'validator';

import { get_env } from './env.ts';

import { AppError } from './error_utils.ts';

const email_is_on_host = (email: string, allowed_hosts: string[]) =>
  _.some(allowed_hosts, (host) => email.endsWith(host));

const get_user_email = (user: Express.User) => {
  const email = user.email;

  if (typeof email === 'undefined' || !validator.isEmail(email)) {
    throw new AppError(400, `Expected a valid email address got \`${email}\``);
  }

  return email;
};

export type AuthzRule = (user: Express.User) => void;

const email_has_allowed_basic_host: AuthzRule = (user) => {
  const email = get_user_email(user);

  const { AUTHZ_EMAIL_HOSTS_ALLOWED } = get_env();

  if (
    AUTHZ_EMAIL_HOSTS_ALLOWED !== '*' &&
    !email_is_on_host(email, AUTHZ_EMAIL_HOSTS_ALLOWED)
  ) {
    throw new AppError(
      403,
      `Provided email \`${email}\` is not allowed to authenticate.`,
    );
  }
};

const email_has_allowed_privileged_host: AuthzRule = (user) => {
  const email = get_user_email(user);

  const { AUTHZ_EMAIL_HOSTS_ALLOWED_TO_OWN_COLLECTIONS } = get_env();

  if (!email_is_on_host(email, AUTHZ_EMAIL_HOSTS_ALLOWED_TO_OWN_COLLECTIONS)) {
    throw new AppError(
      403,
      `Provided email \`${email}\` is not allowed elevated privileges.`,
    );
  }
};

const email_is_super_user: AuthzRule = (user) => {
  const email = get_user_email(user);

  const { AUTHZ_SUPER_ADMINS } = get_env();

  if (!_.includes(AUTHZ_SUPER_ADMINS, email)) {
    throw new AppError(403, `Provided email \`${email}\` is not an admin.`);
  }
};

export const apply_rules_to_user = (
  user: Express.User,
  ...rules: AuthzRule[]
) => rules.forEach((rule) => rule(user));

export const user_email_allowed_rule: AuthzRule = (user: Express.User) =>
  apply_rules_to_user(user, email_has_allowed_basic_host); // TODO: potentially also require that non-PHAC/HC emails have been invited to at least one dataset?

export const user_email_can_own_collections_rule: AuthzRule = (
  user: Express.User,
) =>
  apply_rules_to_user(
    user,
    email_has_allowed_basic_host,
    email_has_allowed_privileged_host,
  );

export const user_email_is_super_user_rule: AuthzRule = (user: Express.User) =>
  apply_rules_to_user(
    user,
    email_has_allowed_basic_host,
    email_has_allowed_privileged_host,
    email_is_super_user,
  );

export const check_authz_rules = (user: Express.User, ...rules: AuthzRule[]) =>
  _.every(rules, (rule) => {
    try {
      rule(user);
      return true;
    } catch {
      return false;
    }
  });
