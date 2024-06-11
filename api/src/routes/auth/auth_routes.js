import express from 'express';
import passport from 'passport';
import { Strategy as MagicLinkStrategy } from 'passport-magic-link';

import {
  sendVerificationRequestGCNotify,
  sendVerificationRequestConsole,
} from './auth_utils.js';

const get_post_auth_redirect = (req) => {
  const post_auth_redirect =
    req.body.post_auth_redirect || req.query.post_auth_redirect;

  // only allow relative redirects to prevent cross origin redirects
  const provided_redirect_is_relative =
    post_auth_redirect && post_auth_redirect.startsWith('/');

  return provided_redirect_is_relative ? post_auth_redirect : '/';
};

const {
  IS_LOCAL_ENV = false,
  FORCE_ENABLE_GCNOTIFY = false,
  MAGIC_LINK_SECRET,
} = process.env;

passport.use(
  new MagicLinkStrategy(
    {
      secret: MAGIC_LINK_SECRET,
      userFields: ['email'],
      tokenField: 'token',
      passReqToCallbacks: true,
      verifyUserAfterToken: true,
    },
    async function sendToken(req, user, token) {
      const verification_url = `${
        req.headers.origin
      }/api/auth/signin/verify-email?${new URLSearchParams({
        token,
        post_auth_redirect: get_post_auth_redirect(req),
      })}`;

      return IS_LOCAL_ENV && !FORCE_ENABLE_GCNOTIFY
        ? sendVerificationRequestConsole(verification_url)
        : sendVerificationRequestGCNotify(user.email, verification_url);
    },
    async function verifyUser(_req, user) {
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
passport.serializeUser((user, callback) =>
  process.nextTick(() => callback(null, user)),
);
passport.deserializeUser((user, callback) =>
  process.nextTick(() => callback(null, user)),
);

const auth_router = express.Router();

auth_router.post(
  '/signin/gcnotify',
  passport.authenticate('magiclink', {
    action: 'requestToken',
  }),
  (_req, res) => res.status(200).send(),
);

auth_router.get(
  '/signin/verify-email',
  passport.authenticate('magiclink', { action: 'acceptToken' }),
  (req, res) => {
    const a = get_post_auth_redirect(req);
    debugger;
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

export { auth_router };
