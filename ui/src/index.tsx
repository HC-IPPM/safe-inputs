import React from 'react'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { ChakraProvider, extendTheme, ThemeConfig, withDefaultColorScheme, } from '@chakra-ui/react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom"

import ExcelParsingPage from './pages/excelParser'
import DoesNotExistPage from './pages/noLocationPage'
import PageFour from './pages/pageFour'
import ThirdPage from './pages/pageThree'
import SecondPage from './pages/pageTwo'
import reportWebVitals from './reportWebVitals'
import workerInstance from './serviceWorker'

import './index.css'

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
          fontSize: { base: '12px', sm: '14px', md: '16px', lg: '16px' }
        },
        header: {
          fontSize: { base: '20px', sm: '24px', md: '30px', lg: '30px' }
        },       
        '.menu': {
          fontSize: { base: '12px', sm: '14px', md: '16px', lg: '16px' },
        } 
      }
    },
  },
)

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
})

const root = ReactDOM.createRoot(
  document.getElementById('root') || document.body,
)
root.render(
  <BrowserRouter>
    <React.StrictMode >
      <ApolloProvider client={client}>
        <ChakraProvider theme={theme} >
          <Routes >
            <Route path="/" element={<ExcelParsingPage parseWorker={workerInstance} />} />
            <Route path='/secondpage' element={<SecondPage />} />
            <Route path='/thirdpage' element={<ThirdPage />} />
            <Route path='/pagefour' element={<PageFour />} />
            <Route path="*" element={<DoesNotExistPage />} />

          </Routes>
        </ChakraProvider>
      </ApolloProvider>
    </React.StrictMode >
  </BrowserRouter>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
