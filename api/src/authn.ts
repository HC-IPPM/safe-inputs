import express from 'express';

import type { PassportStatic } from 'passport';
import { Strategy as MagicLinkStrategy } from 'passport-magic-link';

import { UAParser } from 'ua-parser-js';

import {
  get_or_create_user,
  update_user_last_login_times,
  UserByIdLoader,
} from 'src/schema/core/User/UserModel.ts';

import {
  user_email_allowed_rule,
  user_email_is_super_user_rule,
  user_email_can_own_collections_rule,
  check_authz_rules,
} from './authz.ts';

import { get_env } from './env.ts';
import { AppError } from './error_utils.ts';

const should_send_token_via_email = () => {
  const { DEV_IS_LOCAL_ENV, DEV_FORCE_ENABLE_GCNOTIFY } = get_env();

  return !DEV_IS_LOCAL_ENV || DEV_FORCE_ENABLE_GCNOTIFY;
};

const get_post_auth_redirect = (req: Express.Request) => {
  const post_auth_redirect =
    req.body?.post_auth_redirect || req.query?.post_auth_redirect;

  // only allow relative redirects to prevent cross origin redirects
  const provided_redirect_is_relative =
    post_auth_redirect && post_auth_redirect.startsWith('/');

  return provided_redirect_is_relative ? post_auth_redirect : '/';
};

const ten_minutes_in_miliseconds = 60 * 10 * 1000;
const format_date = (locale: 'en' | 'fr', date: Date) =>
  new Intl.DateTimeFormat(`${locale}-CA`, {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);

export const configure_passport_js = (passport: PassportStatic) => {
  const {
    AUTHN_MAGIC_LINK_SECRET,
    AUTHN_GC_NOTIFY_API_KEY,
    AUTHN_GC_NOTIFY_TEMPLATE_ID,
  } = get_env();

  passport.use(
    new MagicLinkStrategy(
      {
        secret: AUTHN_MAGIC_LINK_SECRET,
        userFields: ['email'],
        tokenField: 'token',
        passReqToCallbacks: true,
        verifyUserAfterToken: false, // verifyUser is called before sendToken
        ttl: ten_minutes_in_miliseconds / 1000,
      },
      async function sendToken(
        req: Express.Request,
        user: Express.User,
        token: string,
      ) {
        const verification_url = `${
          req.headers.origin
        }/api/auth/signin/verify-email?${new URLSearchParams({
          token,
          post_auth_redirect: get_post_auth_redirect(req),
        })}`;

        if (should_send_token_via_email()) {
          const received_date = new Date();
          const expires_date = new Date(
            received_date.getTime() + ten_minutes_in_miliseconds,
          );

          const user_agent_parser = new UAParser(
            // TODO big typing abomination, this is just a hack around my bad Express.Request
            // typing, to get this out in time for an urgent demo
            (req as unknown as { get: (header: string) => string }).get(
              'user-agent',
            ),
          );

          const response = await fetch(
            'https://api.notification.canada.ca/v2/notifications/email',
            {
              method: 'POST',
              credentials: 'include',
              headers: {
                Authorization: AUTHN_GC_NOTIFY_API_KEY,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email_address: user.email,
                template_id: AUTHN_GC_NOTIFY_TEMPLATE_ID,
                personalisation: {
                  sign_in_link: verification_url,
                  browser: user_agent_parser.getBrowser().name,
                  operating_system: user_agent_parser.getOS().name,
                  date_time_en: format_date('en', received_date),
                  date_time_fr: format_date('fr', received_date),
                  expiration_time_en: format_date('en', expires_date),
                  expiration_time_fr: format_date('fr', expires_date),
                },
              }),
            },
          );

          if (!response.ok) {
            const { errors } = await response.json();
            throw new Error(JSON.stringify(errors));
          }

          return response;
        } else {
          req.locals = { verification_url, ...req.locals };
        }
      },
      async function verifyUser(_req: Express.Request, user: Express.User) {
        user_email_allowed_rule(user);

        const mongoose_doc = await get_or_create_user(user.email!);

        // this result is passed to passport.serializeUser, see not below
        return {
          ...user,
          id: mongoose_doc.id,
        };
      },
    ),
  );

  // Note: the user arg to serializeUser is the return value of verifyUser above, and the value passed to the callback is
  // what's stored in the session store database. To keep session information from going stale against the User records in mongo,
  // only the serialized user id matters, and deseralizeUser will re-fetch the user's info from the DB for each subsequent request
  passport.serializeUser((user: Express.User, callback) =>
    process.nextTick(() =>
      typeof user?.id === 'undefined'
        ? callback(new AppError(500, 'Missing user id'), null)
        : callback(null, user),
    ),
  );
  passport.deserializeUser((user: Express.User, callback) =>
    UserByIdLoader.load(user.id!)
      .then((mongoose_doc) =>
        typeof mongoose_doc === 'undefined'
          ? callback(new AppError(500, 'User not found'), null)
          : callback(null, {
              ...user,
              email: mongoose_doc.email,
              mongoose_doc,
            }),
      )
      .catch((error) => callback(error, null)),
  );
};

export const user_is_authenticated = (
  user?: Express.User | Express.AuthenticatedUser,
): user is Express.AuthenticatedUser =>
  typeof user?.mongoose_doc?._id !== 'undefined';

export const get_auth_router = (passport: PassportStatic) => {
  const auth_router = express.Router();

  auth_router.post(
    '/signin/gcnotify',
    passport.authenticate('magiclink', {
      // @ts-expect-error magiclink's "action" parameterisn't part of passport.js's typing. Extending pasport.js' types is complicated by their export pattern
      action: 'requestToken',
    }),
    (req, res) =>
      res
        .status(200)
        .send(
          should_send_token_via_email()
            ? {}
            : { verification_url: req.locals?.verification_url },
        ),
  );

  auth_router.get(
    '/signin/verify-email',
    // @ts-expect-error magiclink's "action" parameterisn't part of passport.js's typing. Extending pasport.js' types is complicated by their export pattern
    passport.authenticate('magiclink', { action: 'acceptToken' }),
    async (req, res) => {
      await update_user_last_login_times(req!.user!.email!); // known to be non-null, previous handler will throw a 401 if the request doesn't have a (valid) session

      res.redirect(get_post_auth_redirect(req));
    },
  );

  auth_router.post('/signout', (req, res, next) =>
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).send();
    }),
  );

  auth_router.get('/session', (req, res) =>
    res.send({
      email: req.user?.email,
      is_super_user:
        req.user && check_authz_rules(req.user, user_email_is_super_user_rule),
      can_own_collections:
        req.user &&
        check_authz_rules(req.user, user_email_can_own_collections_rule),
    }),
  );

  return auth_router;
};
