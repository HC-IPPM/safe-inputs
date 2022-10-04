import React from 'react'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import {
  ChakraProvider,
  extendTheme,
  Flex,
  ThemeConfig,
  withDefaultColorScheme,
  // Flex
} from '@chakra-ui/react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, } from "react-router-dom";

// import ExcelParsingPage from './excelParser'
// import SecondPage from './pageTwo';
import App from './App'
import ExcelParsingPage from './excelParser'
import SecondPage from './pageTwo'
import reportWebVitals from './reportWebVitals'
// eslint-disable-next-line import/order
import workerInstance from './serviceWorker'

import './index.css'
import TopHeader1 from './topHeader';


const themeConfig: ThemeConfig = {
  useSystemColorMode: true,
  initialColorMode: 'light',
}
const theme = extendTheme(
  themeConfig,
  withDefaultColorScheme({ colorScheme: 'blue' }),
)

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
})

const root = ReactDOM.createRoot(
  document.getElementById('root') || document.body,
)
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme}>
<<<<<<< HEAD
        {/* <BrowserRouter>
          <Routes>
            <Route path="" element={<ExcelParsingPage parseWorker={workerInstance} />} />
            {/* <Route path='/secondPage' element={<SecondPage />} /> 
            <Route path="/ExcelParsingPage" element={<ExcelParsingPage parseWorker={workerInstance} />} />
            <Route path="*" element={<Flex background='grey' h='100vh' color='white' justify={'center'} align={'center'}>This webpage is not available </Flex>} />
          </Routes> 
        </BrowserRouter>*/}
        <SecondPage />
        <ExcelParsingPage parseWorker={workerInstance} />
=======
        <BrowserRouter>
          <Routes>
            <Route path="" element={<ExcelParsingPage parseWorker={workerInstance} />} />
            {/* <Route path='/secondPage' element={<SecondPage />} /> */}
            <Route path="/ExcelParsingPage" element={<ExcelParsingPage parseWorker={workerInstance} />} />
            <Route path="*" element={<Flex background='grey' h='100vh' color='white' justify={'center'} align={'center'}>This webpage is not available </Flex>} />
          </Routes>
        </BrowserRouter>
>>>>>>> main
      </ChakraProvider>
    </ApolloProvider>
  </React.StrictMode >,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
