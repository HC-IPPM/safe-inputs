import _ from 'lodash';

export type Session = { email?: string };

const { IS_LOCAL_DEV } = ENV;

const get_auth_url = (auth_base_url: string, path: string) =>
  `${auth_base_url}/${path}`;

const auth_get = async (auth_base_url: string, path: string) => {
  const response = await fetch(get_auth_url(auth_base_url, path), {
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return { response, data };
};

const get_csrf_token = async (auth_base_url: string) => {
  const { data } = await auth_get(auth_base_url, 'csrf-token');

  if (typeof data?.csrfToken === 'string') {
    return data.csrfToken as string;
  } else {
    throw new Error(
      'CSRF response body did not contain the expected `csrfToken` string',
    );
  }
};

export const get_session = async (auth_base_url: string) => {
  const { data } = await auth_get(auth_base_url, 'session');

  if (typeof data?.email === 'string') {
    return data as Session;
  } else {
    return null;
  }
};

const auth_post = async (
  auth_base_url: string,
  path: string,
  options?: {
    post_auth_redirect?: string;
    email?: string;
  },
) => {
  const csrf_token = await get_csrf_token(auth_base_url);

  return await fetch(get_auth_url(auth_base_url, path), {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-csrf-token': csrf_token,
    },
    body: new URLSearchParams(
      _.omitBy(options, (value) => typeof value === 'undefined'),
    ),
  });
};

export const email_sign_in = async (
  auth_base_url: string,
  email: string,
  post_auth_redirect?: string,
) => {
  if (post_auth_redirect && !post_auth_redirect.startsWith('/')) {
    throw new Error(
      `Post auth redirect must be a relative URL, provided value is not (${post_auth_redirect})`,
    );
  }

  const response = await auth_post(auth_base_url, 'signin/gcnotify', {
    email,
    post_auth_redirect,
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  if (IS_LOCAL_DEV !== 'true' && data?.verification_url) {
    throw new Error(
      'The server should NEVER include the verification_url in a sign in response when not in local dev!',
    );
  }

  return { response, data };
};

export const sign_out = async (auth_base_url: string) => {
  return await auth_post(auth_base_url, 'signout');
};
