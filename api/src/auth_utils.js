const { GCNotifyApiKey, GCNotifyTemplateID } = process.env;

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
