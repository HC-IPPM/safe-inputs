import _ from 'lodash';
import validator from 'validator';

import { get_env } from './env.ts';

import { AppError } from './error_utils.ts';

const email_is_on_host = (email: string, allowed_hosts: string[]) =>
  _.some(allowed_hosts, (host) => email.endsWith(host));

const email_has_allowed_basic_host = (email: string) => {
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

const email_has_allowed_privileged_host = (email: string) => {
  const { AUTHZ_EMAIL_HOSTS_ALLOWED_PRIVILEGES } = get_env();

  if (!email_is_on_host(email, AUTHZ_EMAIL_HOSTS_ALLOWED_PRIVILEGES)) {
    throw new AppError(
      403,
      `Provided email \`${email}\` is not allowed elevated privileges.`,
    );
  }
};

const email_is_super_user = (email: string) => {
  const { AUTHZ_SUPER_ADMINS } = get_env();

  if (!_.includes(AUTHZ_SUPER_ADMINS, email)) {
    throw new AppError(403, `Provided email \`${email}\` is not an admin.`);
  }
};

const get_user_email = (user: string | Express.User) => {
  const email = (() => {
    if (typeof user === 'string') {
      return user;
    } else {
      return user.email;
    }
  })();

  if (typeof email === 'undefined' || !validator.isEmail(email)) {
    throw new AppError(400, `Expected a valid email address got \`${email}\``);
  }

  return email;
};

const apply_rules_to_user = (
  user: string | Express.User,
  ...rules: ((email: string) => void)[]
) => {
  const email = get_user_email(user);

  rules.forEach((rule) => rule(email));
};

export const validate_user_email_allowed = (user: string | Express.User) =>
  apply_rules_to_user(user, email_has_allowed_basic_host); // TODO: potentially also require that non-PHAC/HC emails have been invited to at least one dataset?

export const validate_user_can_have_privileges = (
  user: string | Express.User,
) =>
  apply_rules_to_user(
    user,
    email_has_allowed_basic_host,
    email_has_allowed_privileged_host,
  );

export const validate_user_is_super_user = (user: string | Express.User) =>
  apply_rules_to_user(
    user,
    email_has_allowed_basic_host,
    email_has_allowed_privileged_host,
    email_is_super_user,
  );
