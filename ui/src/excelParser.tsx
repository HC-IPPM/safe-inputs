import React, {  } from 'react'



import { ParseWorker } from './serviceWorker'
import './App.css'
// eslint-disable-next-line import/order
import App from './App'
// eslint-disable-next-line import/order
import workerInstance from './serviceWorker'
import TopHeader1 from './topHeader'


function App1({ parseWorker }: { parseWorker: ParseWorker }) {

   return(
    <>
    <TopHeader1 />
    <App parseWorker={workerInstance} />
    </>
  )
}

export default App1


