import express from 'express';
import passport from 'passport';
import { Strategy as MagicLinkStrategy } from 'passport-magic-link';

import {
  sendVerificationRequestGCNotify,
  sendVerificationRequestConsole,
} from './auth_utils';

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
      verifyUserAfterToken: true,
    },
    async function sendToken(user, token, request) {
      const verification_url = `${get_client_host(
        request,
      )}/api/auth/email/verify?token=${token}`;

      return IS_LOCAL_ENV && !FORCE_ENABLE_GCNOTIFY
        ? sendVerificationRequestConsole(verification_url)
        : sendVerificationRequestGCNotify(user.email, verification_url);
    },
    async function verifyUser(user) {
      // TODO: verification logic
      // Potentially:
      //  - PHAC and HC emails can always verify
      //  - non-PHAC/HC emails only verify if they've been invited to at least one dataset?
      return true;
    },
  ),
);

passport.serializeUser((user, callback) =>
  process.nextTick(() => callback(null, { id: user.id, email: user.email })),
);

passport.deserializeUser((user, callback) =>
  process.nextTick(() => callback(null, user)),
);

const auth_router = express.Router();

auth_router.post(
  '/email',
  passport.authenticate('magiclink', {
    action: 'requestToken',
  }),
);

auth_router.get(
  '/email/verify',
  passport.authenticate('magiclink'),
  (req, res, next) => {
    // TODO check req for post-login redirect value, use if can
    // url.startsWith(get_client_host(req));
    res.redirect(get_client_host(req));
  },
);

auth_router.post('/logout', (req, res, next) =>
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect(get_client_host(req));
  }),
);

export { auth_router };
