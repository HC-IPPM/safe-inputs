import type { Session } from '@auth/core/types';

// Partially based on https://github.com/nextauthjs/next-auth/blob/5d532cce99ee77447454a1eb9578e61d80e451fd/packages/next-auth/src/react.tsx
// Adapted to work in our non-Next.js SPA, simplified to only care about our use cases (email auth only, different redirect and syncing behaviour, etc)

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
    'csrf',
  );

  return response_data?.csrfToken ?? '';
};

const auth_post = async (
  auth_base_url: string,
  path: string,
  options?: {
    callback_url?: string;
    email?: string;
  },
) => {
  const csrf_token = await get_csrf_token(auth_base_url);

  const { callback_url, email } = options ?? {};

  return await fetch(get_auth_url(auth_base_url, path), {
    method: 'post',
    redirect: 'manual',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Auth-Return-Redirect': '0',
    },
    body: new URLSearchParams({
      csrfToken: csrf_token,
      ...(typeof callback_url !== 'undefined'
        ? { callbackUrl: callback_url }
        : {}),
      ...(typeof email !== 'undefined' ? { email } : {}),
    }),
  });
};

export const get_session = async (auth_base_url: string) => {
  return await auth_get<Session | null>(auth_base_url, 'session');
};

export const email_sign_in = async (
  auth_base_url: string,
  email: string,
  callback_url: string,
) => {
  return await auth_post(auth_base_url, 'signin/gcnotify', {
    email,
    callback_url,
  });
};

export const sign_out = async (auth_base_url: string) => {
  await auth_post(auth_base_url, 'signout');
};
