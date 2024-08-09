import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';

import type { PropsWithChildren } from 'react';

import { messages } from 'src/i18n/locales/en/messages.ts';
import { messages as frMessages } from 'src/i18n/locales/fr/messages.ts';

i18n.load({
  en: messages,
  fr: frMessages,
});

export const i18nInstance = i18n;
export const TestProviders = ({
  children,
  i18n_lang = 'en',
}: PropsWithChildren<{ i18n_lang?: 'en' | 'fr' }>) => {
  i18n.activate(i18n_lang);

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
};
