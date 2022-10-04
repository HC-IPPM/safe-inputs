import React, { } from 'react'

import './App.css'
import App from './App'
import SecondPage from './pageTwo'
import { ParseWorker } from './serviceWorker'
import workerInstance from './serviceWorker'



function ExcelParsingPage({ parseWorker }: { parseWorker: ParseWorker }) {

  return (
    <>
      <SecondPage />
      <App parseWorker={workerInstance} />
    </>
  )
}

export default ExcelParsingPage;


