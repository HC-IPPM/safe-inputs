import './index.css';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  ApolloProvider,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

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

import { ErrorBoundary } from 'react-error-boundary';

import {
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { get_csrf_token, csrf_header } from './components/auth/auth_utils.ts';
import { SessionProvider } from './components/auth/session.tsx';

import AppErrorFallback from './components/error/AppErrorFallback.tsx';
import { messages as enMessages } from './i18n/locales/en/messages.ts';
import { messages as frMessages } from './i18n/locales/fr/messages.ts';

import AdminDashboard from './pages/AdminDashboard.tsx';
import CollectionManagement from './pages/CollectionManagement.tsx';
import ColumnManagement from './pages/ColumnManagement.tsx';
import CreateCollection from './pages/CreateCollection.tsx';
import ExcelParser from './pages/ExcelParser.tsx';
import Home from './pages/Home.tsx';
import NavWrapper from './pages/NavWrapper.tsx';
import SignIn from './pages/SignIn.tsx';
import TermsAndConditions from './pages/TermsAndConditions.tsx';

// chakra themes
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

// i18n
i18n.load({
  en: enMessages,
  fr: frMessages,
});

i18n.activate('en');

// router
// TODO https://reactrouter.com/en/main/upgrading/v6-data#start-lifting-routes-and-leveraging-the-data-apis
const RouterRoot = () => (
  <Routes>
    <Route path="/" element={<NavWrapper />}>
      <Route path="" element={<Home />} />
      <Route path="signin" element={<SignIn />} />
      <Route path="create-collection" element={<CreateCollection />} />
      <Route
        path="manage-collection/:collectionID"
        element={<CollectionManagement />}
      />
      <Route
        path="manage-collection/:collectionID/edit-column/:columnHeader"
        element={<ColumnManagement />}
      />
      <Route
        path="manage-collection/:collectionID/create-column"
        element={<ColumnManagement />}
      />
      <Route
        path="upload-records/:collectionID"
        element={<div>Upload records route TODO</div>}
      />
      <Route path="admin" element={<AdminDashboard />} />
      <Route path="excel-parser" element={<ExcelParser />} />
      <Route path="termsAndConditions" element={<TermsAndConditions />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Route>
  </Routes>
);
const router = createBrowserRouter([{ path: '*', element: <RouterRoot /> }]);

// render
const container = document.getElementById('react-root');
const root = createRoot(container!);

const auth_base_url = '/api/auth';

const csrfMiddleware = setContext(async () => {
  const csrf_token = await get_csrf_token(auth_base_url);
  return { headers: { [csrf_header]: csrf_token } };
});
const httpLink = new HttpLink({ uri: '/api/graphql' });
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([csrfMiddleware, httpLink]),
});

root.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={AppErrorFallback}>
      <SessionProvider authBaseURL={auth_base_url}>
        <I18nProvider i18n={i18n}>
          <ApolloProvider client={client}>
            <ChakraProvider theme={theme}>
              <RouterProvider router={router} />
            </ChakraProvider>
          </ApolloProvider>
        </I18nProvider>
      </SessionProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
