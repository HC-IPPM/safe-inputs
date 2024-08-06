import { cleanEnv, port, host, str, bool, num, makeValidator } from 'envalid';

import validator from 'validator';

const emailList = makeValidator((val: string) => {
  const emails = val.split(',');

  if (emails.every((email) => validator.isEmail(email))) {
    return emails;
  } else {
    throw new Error('Expected comma seperated email list');
  }
});

const validate_email_host_list = (val: string) => {
  const email_hosts = val.split(',');

  if (
    email_hosts
      .map((host) => `arbitrary@${host}`)
      .every((email) => validator.isEmail(email))
  ) {
    return email_hosts;
  } else {
    throw new Error(
      'Expected comma seperated list of email suffixes (@ included)',
    );
  }
};
const emailHostList = makeValidator(validate_email_host_list);
const emailHostListOrWildcard = makeValidator((val) =>
  val === '*' ? val : validate_email_host_list(val),
);

const additional_authz_validation = ({
  AUTHZ_EMAIL_HOSTS_ALLOWED,
  AUTHZ_EMAIL_HOSTS_ALLOWED_TO_OWN_COLLECTIONS,
  AUTHZ_SUPER_ADMINS,
}: {
  AUTHZ_EMAIL_HOSTS_ALLOWED: string[] | '*';
  AUTHZ_EMAIL_HOSTS_ALLOWED_TO_OWN_COLLECTIONS: string[];
  AUTHZ_SUPER_ADMINS: string[];
}) => {
  if (
    AUTHZ_EMAIL_HOSTS_ALLOWED !== '*' &&
    !AUTHZ_EMAIL_HOSTS_ALLOWED_TO_OWN_COLLECTIONS.every((privileged_host) =>
      AUTHZ_EMAIL_HOSTS_ALLOWED.includes(privileged_host),
    )
  ) {
    throw new Error(
      'AUTHZ_EMAIL_HOSTS_ALLOWED_TO_OWN_COLLECTIONS must be a subset of AUTHZ_EMAIL_HOSTS_ALLOWED',
    );
  }

  if (
    !AUTHZ_SUPER_ADMINS.every((super_admins) =>
      AUTHZ_EMAIL_HOSTS_ALLOWED_TO_OWN_COLLECTIONS.some((privileged_host) =>
        super_admins.endsWith(privileged_host),
      ),
    )
  ) {
    throw new Error(
      'All members of AUTHZ_SUPER_ADMINS must belong to hosts found in AUTHZ_EMAIL_HOSTS_ALLOWED_TO_OWN_COLLECTIONS',
    );
  }
};

const boolFalseIfProd = (spec: { default: boolean }) => {
  const is_prod =
    process.env.DEV_IS_LOCAL_ENV !== 'true' &&
    process.env.DEV_IS_TEST_ENV !== 'true';

  return bool({
    ...spec,
    choices: is_prod ? [false] : [false, true],
  });
};

export const get_env = () => {
  // NOTE: this does not populate process.env, assumes it's already populated (e.g. via dotenv in the entrypoint file)
  const processed_env = cleanEnv(process.env, {
    EXPRESS_PORT: port({ default: 3000 }),
    EXPRESS_HOST: host({ default: '0.0.0.0' }),

    MDB_CONNECT_STRING: str(),

    MIDDLEWARE_MAX_SESSION_AGE: num({ default: 24 * 60 * 60 }),
    MIDDLEWARE_COOKIE_SIGNING_SECRET: str(),
    MIDDLEWARE_SESSION_STORE_SECRET: str(),
    MIDDLEWARE_CSRF_SECRET: str(),

    AUTHN_MAGIC_LINK_SECRET: str(),
    AUTHN_GC_NOTIFY_API_KEY: str(),
    AUTHN_GC_NOTIFY_TEMPLATE_ID: str(),

    AUTHZ_EMAIL_HOSTS_ALLOWED: emailHostListOrWildcard(),
    AUTHZ_EMAIL_HOSTS_ALLOWED_TO_OWN_COLLECTIONS: emailHostList(),
    AUTHZ_SUPER_ADMINS: emailList(),

    DEV_IS_LOCAL_ENV: boolFalseIfProd({ default: false }),
    DEV_IS_TEST_ENV: boolFalseIfProd({ default: false }),
    DEV_FORCE_ENABLE_GCNOTIFY: boolFalseIfProd({ default: false }),
    DEV_FORCE_DISABLE_CSRF_PROTECTION: boolFalseIfProd({ default: false }),
  });

  additional_authz_validation(processed_env);

  return processed_env;
};
