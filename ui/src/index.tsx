import React from 'react'

import './index.css'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import {
  ChakraProvider,
  extendTheme,
  ThemeConfig,
  withDefaultColorScheme,
} from '@chakra-ui/react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import ExcelParsingPage from './pages/excelParser'
import NavPage from './pages/navPage'
import DoesNotExistPage from './pages/noLocationPage'
import TermsConditions from './pages/termsConditions'
import reportWebVitals from './reportWebVitals'
import workerInstance from './serviceWorker'

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

const client = new ApolloClient({
  uri: '/graphql',
  // uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
})

const root = ReactDOM.createRoot(
  (document.getElementById('root') as HTMLElement) || document.body,
)
root.render(
  <BrowserRouter>
    {/* <React.StrictMode> */}
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme}>
        <Routes>
          {/* All elements inside the <NavPage/> route will have the header and footer added automatically */}
          <Route path="/" element={<NavPage />}>
            <Route
              path=""
              element={<ExcelParsingPage parseWorker={workerInstance} />}
            />
            <Route path="termsConditions" element={<TermsConditions />}></Route>
          </Route>
          <Route path="*" element={<DoesNotExistPage />}></Route>
          
        </Routes>
      </ChakraProvider>
    </ApolloProvider>
    {/* </React.StrictMode> */}
  </BrowserRouter>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
