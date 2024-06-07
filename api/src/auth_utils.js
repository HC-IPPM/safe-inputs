const { GCNotifyApiKey, GCNotifyTemplateID, FIX_AUTH_REDIRECT_BASE } =
  process.env;

export const sendVerificationRequestGCNotify = async ({ identifier, url }) => {
  const response = await fetch(
    'https://api.notification.canada.ca/v2/notifications/email',
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: GCNotifyApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: identifier,
        template_id: GCNotifyTemplateID,
        personalisation: {
          sign_in_link: url,
        },
      }),
    },
  );

  if (!response.ok) {
    const { errors } = await response.json();
    throw new Error(JSON.stringify(errors));
  }
};

export const sendVerificationRequestConsole = async ({ url }) => {
  console.log(`\x1b[31mDEV MODE, your session auth url is:\x1b[0m ${url}`);
};

export const redirectWithFix = async ({ url, baseUrl }) => {
  // Temporary fix for upstream bug https://github.com/nextauthjs/next-auth/issues/10928https://github.com/nextauthjs/next-auth/issues/10928

  const base = FIX_AUTH_REDIRECT_BASE || baseUrl;

  // default redirect callback https://github.com/nextauthjs/next-auth/blob/ea03353ba1e547526ae3357357a715d8714c590c/packages/core/src/lib/init.ts#L33
  if (url.startsWith('/')) {
    return `${base}${url}`;
  } else if (new URL(url).origin === base) {
    return url;
  } else {
    return base;
  }
};
