import _ from 'lodash';

export type Session = { email?: string };

const get_auth_url = (auth_base_url: string, path: string) =>
  `${auth_base_url}/${path}`;

const auth_get = async <ResponseData>(
  auth_base_url: string,
  path: string,
): Promise<ResponseData> => {
  const response = await fetch(get_auth_url(auth_base_url, path), {
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

const get_csrf_token = async (auth_base_url: string) => {
  const response_data = await auth_get<{ csrfToken: string }>(
    auth_base_url,
    'csrf-token',
  );

  return response_data?.csrfToken ?? '';
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

export const get_session = async (auth_base_url: string) => {
  const session = await auth_get<Session>(auth_base_url, 'session');
  return session?.email ? session : null;
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

  return await auth_post(auth_base_url, 'signin/gcnotify', {
    email,
    post_auth_redirect,
  });
};

export const sign_out = async (auth_base_url: string) => {
  return await auth_post(auth_base_url, 'signout');
};
