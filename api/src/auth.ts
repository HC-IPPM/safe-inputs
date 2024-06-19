import express from 'express';

import type { PassportStatic } from 'passport';
import { Strategy as MagicLinkStrategy } from 'passport-magic-link';

import { get_env } from './env.ts';

const get_post_auth_redirect = (req: Express.Request) => {
  const post_auth_redirect =
    req.body?.post_auth_redirect || req.query?.post_auth_redirect;

  // only allow relative redirects to prevent cross origin redirects
  const provided_redirect_is_relative =
    post_auth_redirect && post_auth_redirect.startsWith('/');

  return provided_redirect_is_relative ? post_auth_redirect : '/';
};

const should_send_token_via_email = () => {
  const { IS_LOCAL_DEV, FORCE_ENABLE_GCNOTIFY } = get_env();

  return !IS_LOCAL_DEV || FORCE_ENABLE_GCNOTIFY;
};

export const configure_passport_js = (passport: PassportStatic) => {
  const { MAGIC_LINK_SECRET, GC_NOTIFY_API_KEY, GC_NOTIFY_TEMPLATE_ID } =
    get_env();

  passport.use(
    new MagicLinkStrategy(
      {
        secret: MAGIC_LINK_SECRET,
        userFields: ['email'],
        tokenField: 'token',
        passReqToCallbacks: true,
        verifyUserAfterToken: true,
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
          const response = await fetch(
            'https://api.notification.canada.ca/v2/notifications/email',
            {
              method: 'POST',
              credentials: 'include',
              headers: {
                Authorization: GC_NOTIFY_API_KEY,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email_address: user.email,
                template_id: GC_NOTIFY_TEMPLATE_ID,
                personalisation: {
                  sign_in_link: verification_url,
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
        // TODO: verification logic
        // Potentially:
        //  - PHAC and HC emails can always verify
        //  - non-PHAC/HC emails only verify if they've been invited to at least one dataset?
        // If we want to bother storing users in the database, we'd do it from here
        return user;
      },
    ),
  );

  // Note: the user arg here is the return value of verifyUser above, and the user passed to the callback is
  // what's stored in the session store and available via the user property on authenticated express requests
  passport.serializeUser((user: Express.User, callback) =>
    process.nextTick(() => callback(null, user)),
  );
  passport.deserializeUser((user: Express.User, callback) =>
    process.nextTick(() => callback(null, user)),
  );
};

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
            : { verification_url: req?.locals?.verification_url },
        ),
  );

  auth_router.get(
    '/signin/verify-email',
    // @ts-expect-error magiclink's "action" parameterisn't part of passport.js's typing. Extending pasport.js' types is complicated by their export pattern
    passport.authenticate('magiclink', { action: 'acceptToken' }),
    (req, res) => {
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
    res.send({ email: req?.user?.email }),
  );

  return auth_router;
};
