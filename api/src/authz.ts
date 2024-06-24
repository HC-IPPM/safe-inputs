import _ from 'lodash';
import validator from 'validator';

import { get_env } from './env.ts';

const email_is_on_host = (email: string, allowed_hosts: string[]) =>
  _.some(allowed_hosts, (host) => email.endsWith(host));

const email_has_allowed_basic_host = (email: string) => {
  const { AUTHZ_EMAIL_HOSTS_ALLOWED } = get_env();

  if (AUTHZ_EMAIL_HOSTS_ALLOWED === '*') {
    return true;
  } else {
    return email_is_on_host(email, AUTHZ_EMAIL_HOSTS_ALLOWED);
  }
};

const email_has_allowed_privileged_host = (email: string) =>
  email_is_on_host(email, get_env().AUTHZ_EMAIL_HOSTS_ALLOWED_PRIVILEGES);

const email_is_super_user = (email: string) =>
  _.includes(get_env().AUTHZ_SUPER_ADMINS, email);

const get_user_email = (user: string | Express.User) => {
  const email = (() => {
    if (typeof user === 'string') {
      return user;
    } else {
      return user.email;
    }
  })();

  if (typeof email === 'undefined' || !validator.isEmail(email)) {
    throw new Error(`Expected a valid email address got \`${email}\``);
  }

  return email;
};

const apply_rules_to_user = (
  user: string | Express.User,
  ...rules: ((email: string) => boolean)[]
) =>
  _.chain(user)
    .thru(get_user_email)
    .thru((email) => _.every(rules, (rule) => rule(email)))
    .value();

export const is_valid_user = (user: string | Express.User) =>
  apply_rules_to_user(user, email_has_allowed_basic_host);

export const is_valid_privileged_user = (user: string | Express.User) =>
  apply_rules_to_user(
    user,
    email_has_allowed_basic_host,
    email_has_allowed_privileged_host,
  );

export const is_valid_super_user = (user: string | Express.User) =>
  apply_rules_to_user(
    user,
    email_has_allowed_basic_host,
    email_has_allowed_privileged_host,
    email_is_super_user,
  );
