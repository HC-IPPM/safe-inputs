import './index.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import type { ThemeConfig } from '@chakra-ui/react';
import {
  ChakraProvider,
  extendTheme,
  withDefaultColorScheme,
} from '@chakra-ui/react';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';

import React from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { SessionProvider } from './components/auth/session.tsx';

import { messages as enMessages } from './i18n/locales/en/messages.ts';
import { messages as frMessages } from './i18n/locales/fr/messages.ts';

import ExcelParser from './pages/ExcelParser.tsx';
import NavWrapper from './pages/NavWrapper.tsx';
import TermsAndConditions from './pages/TermsAndConditions.tsx';

//  _   _
// | |_| |__   ___ _ __ ___   ___
// | __| '_ \ / _ \ '_ ` _ \ / _ \
// | |_| | | |  __/ | | | | |  __/
//  \__|_| |_|\___|_| |_| |_|\___|

const themeConfig: ThemeConfig = {
  useSystemColorMode: true,
  initialColorMode: 'light',
};

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
);

//  _ _  ___
// (_) |( _ ) _ __
// | | |/ _ \| '_ \
// | | | (_) | | | |
// |_|_|\___/|_| |_|

i18n.load({
  en: enMessages,
  fr: frMessages,
});

i18n.activate('en');

//                     _
//  _ __ ___ _ __   __| | ___ _ __
// | '__/ _ \ '_ \ / _` |/ _ \ '__|
// | | |  __/ | | | (_| |  __/ |
// |_|  \___|_| |_|\__,_|\___|_|

const container = document.getElementById('root');
const root = createRoot(container!);
const client = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache(),
});
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SessionProvider authBaseURL="/api/auth">
        <ApolloProvider client={client}>
          <ChakraProvider theme={theme}>
            <I18nProvider i18n={i18n}>
              <Routes>
                <Route path="/" element={<NavWrapper />}>
                  <Route path="" element={<ExcelParser />}></Route>
                  <Route
                    path="/termsAndConditions"
                    element={<TermsAndConditions />}
                  ></Route>
                </Route>
              </Routes>
            </I18nProvider>
          </ChakraProvider>
        </ApolloProvider>
      </SessionProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
