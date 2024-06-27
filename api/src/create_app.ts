import { maxAliasesPlugin } from '@escape.tech/graphql-armor-max-aliases';
import { maxDepthPlugin } from '@escape.tech/graphql-armor-max-depth';
import { createYoga } from '@graphql-yoga/node';

import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import { doubleCsrf } from 'csrf-csrf';
import express from 'express';
import session from 'express-session';
import type { GraphQLSchema } from 'graphql';
import passport from 'passport';

import { configure_passport_js, get_auth_router } from './authn.ts';
import { connect_db, get_db_client } from './db.ts';
import { get_env } from './env.ts';
import { errorHandler } from './error_utils.ts';

export const create_app = async ({
  schema,
  context = {},
}: {
  schema: GraphQLSchema;
  context?: any;
}) => {
  const {
    DEV_IS_LOCAL_ENV,
    MIDDLEWARE_MAX_SESSION_AGE,
    MIDDLEWARE_SESSION_STORE_SECRET,
    MIDDLEWARE_COOKIE_SIGNING_SECRET,
    MIDDLEWARE_CSRF_SECRET,
    DEV_FORCE_DISABLE_CSRF_PROTECTION,
  } = get_env();

  await connect_db();

  const app = express();

  // we'll need to be able to read `X-Forwarded-*` headers, both in prod and when using the dev docker setup
  app.set('trust proxy', true);

  app.use(express.json()); // parses JSON body payloads, converts req.body from a string to object
  app.use(express.urlencoded({ extended: false })); // parses URL-encoded payload parameters on POST/PUT in to req.body fields

  const mongo_store = new MongoStore({
    clientPromise: get_db_client().connect(),
    crypto: {
      secret: MIDDLEWARE_SESSION_STORE_SECRET,
    },
    ttl: MIDDLEWARE_MAX_SESSION_AGE,
    touchAfter: MIDDLEWARE_MAX_SESSION_AGE * 0.9,
  });

  app.use(
    session({
      secret: MIDDLEWARE_COOKIE_SIGNING_SECRET,
      resave: false,
      saveUninitialized: false,
      proxy: true,
      cookie: {
        sameSite: DEV_IS_LOCAL_ENV ? 'lax' : 'strict',
        secure: !DEV_IS_LOCAL_ENV,
      },
      store: mongo_store,
    }),
  );

  // required by csrf-csrf's middleware, parses and signs/validates cookies, makes them available via req.cookies and req.signedCookies (signed cookies
  // are validated with MIDDLEWARE_COOKIE_SIGNING_SECRET) compatible with express-session middleware IF the cookie signing secret is the same between them (still
  // recommended to add session middleware before the cookieParser in app.use order)
  app.use(cookieParser(MIDDLEWARE_COOKIE_SIGNING_SECRET));

  const {
    generateToken, // Use this in your routes to provide a CSRF hash + token cookie and token
    doubleCsrfProtection, // This is the default CSRF protection middleware
  } = doubleCsrf({
    getSecret: () => MIDDLEWARE_CSRF_SECRET,
    cookieName: DEV_IS_LOCAL_ENV ? 'x-csrf-token' : '__Host-psifi.x-csrf-token',
    cookieOptions: {
      sameSite: DEV_IS_LOCAL_ENV ? 'lax' : 'strict',
      secure: !DEV_IS_LOCAL_ENV,
    },
  });

  // important: session middleware needs to come before the CSRF middleware is added!
  if (!DEV_FORCE_DISABLE_CSRF_PROTECTION) {
    app.use(doubleCsrfProtection);
  }

  // add passport and auth routes after CSRF middleware, want them protected
  configure_passport_js(passport); // side-effects based
  app.use(passport.authenticate('session'));
  app.use('/api/auth', get_auth_router(passport));

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

  app.use(errorHandler);

  return app;
};
