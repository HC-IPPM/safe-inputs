import express from 'express';
import passport from 'passport';
import { Strategy as MagicLinkStrategy } from 'passport-magic-link';

import {
  sendVerificationRequestGCNotify,
  sendVerificationRequestConsole,
} from './auth_utils.js';

const {
  IS_LOCAL_ENV = false,
  FORCE_ENABLE_GCNOTIFY = false,
  MAGIC_LINK_SECRET,
  HOST_OVERRIDE,
} = process.env;

// TODO: make sure this works behind the proxy
const get_client_host = (req) => HOST_OVERRIDE || req.host;

passport.use(
  new MagicLinkStrategy(
    {
      secret: MAGIC_LINK_SECRET,
      userFields: ['email'],
      tokenField: 'token',
      passReqToCallbacks: true,
      verifyUserAfterToken: true,
    },
    async function sendToken(request, user, token) {
      const verification_url = `${get_client_host(
        request,
      )}/api/auth/signin/verify-email?token=${token}`;

      return IS_LOCAL_ENV && !FORCE_ENABLE_GCNOTIFY
        ? sendVerificationRequestConsole(verification_url)
        : sendVerificationRequestGCNotify(user.email, verification_url);
    },
    async function verifyUser(request, user) {
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
  (req, res) => res.status(200).send(),
);

auth_router.get(
  '/signin/verify-email',
  passport.authenticate('magiclink', { action: 'acceptToken' }),
  (req, res) => {
    // TODO check req for post-login redirect value, use if can
    // url.startsWith(get_client_host(req));
    res.redirect(get_client_host(req));
  },
);

auth_router.post('/signout', (req, res, next) =>
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect(get_client_host(req));
  }),
);

auth_router.get('/session', (req, res) =>
  res.send({ email: req?.user?.email }),
);

export { auth_router };
