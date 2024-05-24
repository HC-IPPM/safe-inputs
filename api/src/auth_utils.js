// TODO: custom providers for auth.js seem a little sketchy, could be breaking changes
// If nothing else, switch to TS at some point and consume the relevant auth.js provider type info

export const GCNotifyProvider = ({
  maxAge = 24 * 60 * 60,
  GCNotifyApiKey,
  GCNotifyTemplateID,
  options = {},
}) => ({
  id: 'gcnotify',
  type: 'email',
  name: 'GCNotify',
  maxAge,
  async sendVerificationRequest({ identifier, url }) {
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
      throw new Error(
        `Authentication Email could not be sent: ${response.statusText}`,
      );
    }
  },
  options,
});
