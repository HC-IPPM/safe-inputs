import { cleanEnv, port, host, str, bool, num } from 'envalid';

export const get_env = () => {
  const is_prod =
    process.env.IS_LOCAL_DEV !== 'true' && process.env.IS_TEST_ENV !== 'true';

  // NOTE: this does not populate process.env, assumes it's already populated (e.g. via dotenv in the entrypoint file)
  return cleanEnv(process.env, {
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

    // auth
    MAGIC_LINK_SECRET: str(),
    GC_NOTIFY_API_KEY: str(),
    GC_NOTIFY_TEMPLATE_ID: str(),

    // other middleware
    MAX_SESSION_AGE: num({ default: 24 * 60 * 60 }),
    COOKIE_SIGNING_SECRET: str(),
    SESSION_STORE_SECRET: str(),
    CSRF_SECRET: str(),
  });
};
