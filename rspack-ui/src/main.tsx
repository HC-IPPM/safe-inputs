import React from "react";
import { createRoot } from "react-dom/client";

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";

import {
  ChakraProvider,
  extendTheme,
  ThemeConfig,
  withDefaultColorScheme,
} from '@chakra-ui/react'
import { messages as enMessages } from "./i18n/locales/en/messages";
import { messages as frMessages } from "./i18n/locales/fr/messages";


//  _   _                         
// | |_| |__   ___ _ __ ___   ___ 
// | __| '_ \ / _ \ '_ ` _ \ / _ \
// | |_| | | |  __/ | | | | |  __/
//  \__|_| |_|\___|_| |_| |_|\___|

const themeConfig: ThemeConfig = {
  useSystemColorMode: true,
  initialColorMode: 'light',
}

const theme = extendTheme(
  themeConfig,
  withDefaultColorScheme({ colorScheme: 'blue' }),
  {
    styles: {
      global: {
        p: {
          fontSize: { base: '12px', sm: '14px', md: '16px', lg: '16px' },
          fontFamily: 'sans-serif',
        },
        header: {
          fontSize: { base: '20px', sm: '24px', md: '30px', lg: '30px' },
        },
        '.menu': {
          fontSize: {
            base: '18px',
            sm: '15px',
            md: '17px',
            lg: '17px',
            xl: '18px',
          },
          fontFamily: 'sans-serif',
          color: '#333333',
        },
        '.translationButton': {
          fontSize: { base: '12px', sm: '12px', md: '14px' },
        },
      },
    },
  },
)

i18n.load({
  "en": enMessages,
  "fr": frMessages,
});

i18n.activate("en");

const App = () => (
  <I18nProvider i18n={i18n}>
    <Inbox />
  </I18nProvider>
);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
