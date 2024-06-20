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
  AUTHZ_EMAIL_HOSTS_CAN_HAVE_PRIVILEGES,
  AUTHZ_SUPER_ADMINS,
}: {
  AUTHZ_EMAIL_HOSTS_ALLOWED: string[] | '*';
  AUTHZ_EMAIL_HOSTS_CAN_HAVE_PRIVILEGES: string[];
  AUTHZ_SUPER_ADMINS: string[];
}) => {
  if (
    AUTHZ_EMAIL_HOSTS_ALLOWED !== '*' &&
    !AUTHZ_EMAIL_HOSTS_CAN_HAVE_PRIVILEGES.every((privileged_host) =>
      AUTHZ_EMAIL_HOSTS_ALLOWED.includes(privileged_host),
    )
  ) {
    throw new Error(
      'AUTHZ_EMAIL_HOSTS_CAN_HAVE_PRIVILEGES must be a subset of AUTHZ_EMAIL_HOSTS_ALLOWED',
    );
  }

  if (
    !AUTHZ_SUPER_ADMINS.every((super_admins) =>
      AUTHZ_EMAIL_HOSTS_CAN_HAVE_PRIVILEGES.some((privledged_host) =>
        super_admins.endsWith(privledged_host),
      ),
    )
  ) {
    throw new Error(
      'All members of AUTHZ_SUPER_ADMINS must belong to hosts found in AUTHZ_EMAIL_HOSTS_CAN_HAVE_PRIVILEGES',
    );
  }
};

export const get_env = () => {
  const is_prod =
    process.env.IS_LOCAL_DEV !== 'true' && process.env.IS_TEST_ENV !== 'true';

  // NOTE: this does not populate process.env, assumes it's already populated (e.g. via dotenv in the entrypoint file)
  const processed_env = cleanEnv(process.env, {
    // server
    PORT: port({ default: 3000 }),
    HOST: host({ default: '0.0.0.0' }),

    // dev
    IS_LOCAL_DEV: bool({ default: false }),
    FORCE_ENABLE_GCNOTIFY: bool({ default: false }),
    FORCE_DISABLE_CSRF_PROTECTION: bool({
      default: false,
      choices: is_prod ? [false] : [false, true],
    }),

    // MongoDB
    MDB_CONNECT_STRING: str(),

    // authN
    MAGIC_LINK_SECRET: str(),
    GC_NOTIFY_API_KEY: str(),
    GC_NOTIFY_TEMPLATE_ID: str(),

    // authZ
    AUTHZ_EMAIL_HOSTS_ALLOWED: emailHostListOrWildcard(),
    AUTHZ_EMAIL_HOSTS_CAN_HAVE_PRIVILEGES: emailHostList(),
    AUTHZ_SUPER_ADMINS: emailList(),

    // other middleware
    MAX_SESSION_AGE: num({ default: 24 * 60 * 60 }),
    COOKIE_SIGNING_SECRET: str(),
    SESSION_STORE_SECRET: str(),
    CSRF_SECRET: str(),
  });

  additional_authz_validation(processed_env);

  return processed_env;
};
