import { maxAliasesPlugin } from '@escape.tech/graphql-armor-max-aliases';
import { maxDepthPlugin } from '@escape.tech/graphql-armor-max-depth';
import { createYoga } from '@graphql-yoga/node';

import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import { doubleCsrf } from 'csrf-csrf';
import express from 'express';
import session from 'express-session';
import passport from 'passport';

import { connect_db, get_db_client } from './db_utils.js';

import { auth_router } from './routes/auth/auth_routes.js';

const {
  IS_LOCAL_ENV = false,
  MAX_SESSION_AGE = 24 * 60 * 60,
  COOKIE_SIGNING_SECRET,
  SESSION_STORE_SECRET,
  CSRF_SECRET,
} = process.env;

export const create_app = async ({
  schema,
  context = {},
  use_csrf_middleware = true, // only intended for certain test cases, TODO: consider different pattern for disabling CSRF
}) => {
  await connect_db();

  const app = express();

  // we'll need to be able to read `X-Forwarded-*` headers, both in prod and when using the dev docker setup
  app.set('trust proxy', true);

  // parses JSON body payloads, converts req.body from a string to object
  app.use(express.json());

  // parses URL-encoded payload parameters in to req.body fields
  app.use(express.urlencoded({ extended: false }));

  const mongo_store = new MongoStore({
    clientPromise: get_db_client().connect(),
    crypto: {
      secret: SESSION_STORE_SECRET,
    },
    ttl: MAX_SESSION_AGE,
    touchAfter: MAX_SESSION_AGE * 0.9,
  });

  app.use(
    session({
      secret: COOKIE_SIGNING_SECRET,
      resave: false,
      saveUninitialized: false,
      proxy: true,
      cookie: {
        sameSite: IS_LOCAL_ENV ? 'lax' : 'strict',
        secure: !IS_LOCAL_ENV,
      },
      store: mongo_store,
    }),
  );

  // required by csrf-csrf's middleware, parses and signs/validates cookies, makes them available via req.cookies and req.signedCookies (signed cookies
  // are validated with COOKIE_SIGNING_SECRET) compatible with express-session middleware IF the secret common (still recommended to add session
  // middleware before the cookieParser in app.use order)
  app.use(cookieParser(COOKIE_SIGNING_SECRET));

  const {
    generateToken, // Use this in your routes to provide a CSRF hash + token cookie and token
    doubleCsrfProtection, // This is the default CSRF protection middleware
  } = doubleCsrf({
    getSecret: () => CSRF_SECRET,
    cookieName: IS_LOCAL_ENV ? 'x-csrf-token' : '__Host-psifi.x-csrf-token',
    cookieOptions: {
      sameSite: IS_LOCAL_ENV ? 'lax' : 'strict',
      secure: !IS_LOCAL_ENV,
    },
  });

  // important: session middleware needs to come before the middleware is added!
  if (use_csrf_middleware || !IS_LOCAL_ENV) {
    app.use(doubleCsrfProtection);
  }

  // add passport and auth routes after CSRF middleware, want them protected
  app.use(passport.authenticate('session'));
  app.use('/api/auth', auth_router);

  // grouping the csrf-token path with the auth routes, need to add it after the auth router or it will be overwritten
  app.get('/api/auth/csrf-token', (req, res) => {
    const csrfToken = generateToken(req, res, true);
    res.json({ csrfToken });
  });

  const yoga = createYoga({
    schema,
    context,
    plugins: [
      // Explore https://the-guild.dev/graphql/envelop/plugins for more The Guild pluggins
      maxAliasesPlugin({ n: 4 }), // default 15
      maxDepthPlugin({ n: 6 }), // Number of depth allowed | Default: 6
    ],
    graphqlEndpoint: '/api/graphql',
  });

  app.use(yoga.graphqlEndpoint, yoga);

  return app;
};
