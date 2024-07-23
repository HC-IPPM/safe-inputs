import _ from 'lodash';
import validator from 'validator';

import type { UserDocument } from 'src/schema/core/User/UserModel.ts';

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

export type AuthzContext<AdditonalContext> = {
  user: Express.User | UserDocument;
  additional_context: AdditonalContext;
};
export type AuthzRule<AdditonalContext> = (
  authz_context: AuthzContext<AdditonalContext>,
) => void;

const email_has_allowed_basic_host: AuthzRule<unknown> = ({ user }) => {
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

const email_has_allowed_privileged_host: AuthzRule<unknown> = ({ user }) => {
  const email = get_user_email(user);

  const { AUTHZ_EMAIL_HOSTS_ALLOWED_PRIVILEGES } = get_env();

  if (!email_is_on_host(email, AUTHZ_EMAIL_HOSTS_ALLOWED_PRIVILEGES)) {
    throw new AppError(
      403,
      `Provided email \`${email}\` is not allowed elevated privileges.`,
    );
  }
};

const email_is_super_user: AuthzRule<unknown> = ({ user }) => {
  const email = get_user_email(user);

  const { AUTHZ_SUPER_ADMINS } = get_env();

  if (!_.includes(AUTHZ_SUPER_ADMINS, email)) {
    throw new AppError(403, `Provided email \`${email}\` is not an admin.`);
  }
};

export const apply_rules_to_user = <AdditonalContext>(
  authz_context: AuthzContext<AdditonalContext>,
  ...rules: AuthzRule<AdditonalContext>[]
) => rules.forEach((rule) => rule(authz_context));

export const user_email_allowed_rule: AuthzRule<unknown> = (authz_context) =>
  apply_rules_to_user(authz_context, email_has_allowed_basic_host); // TODO: potentially also require that non-PHAC/HC emails have been invited to at least one dataset?

export const user_can_have_privileges_rule: AuthzRule<unknown> = (
  authz_context,
) =>
  apply_rules_to_user(
    authz_context,
    email_has_allowed_basic_host,
    email_has_allowed_privileged_host,
  );

export const user_is_super_user_rule: AuthzRule<unknown> = (authz_context) =>
  apply_rules_to_user(
    authz_context,
    email_has_allowed_basic_host,
    email_has_allowed_privileged_host,
    email_is_super_user,
  );

export const check_authz_rules = <AdditonalContext>(
  authz_context: AuthzContext<AdditonalContext>,
  ...rules: AuthzRule<AdditonalContext>[]
) =>
  _.every(rules, (rule) => {
    try {
      rule(authz_context);
      return true;
    } catch {
      return false;
    }
  });
