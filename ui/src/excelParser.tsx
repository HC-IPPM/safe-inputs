import React, { } from 'react'

import './App.css'
import App from './App'
import { ParseWorker } from './serviceWorker'
import workerInstance from './serviceWorker'
import TopHeader1 from './topHeader'

function ExcelParsingPage({ parseWorker }: { parseWorker: ParseWorker }) {

  return (
    <>
      <TopHeader1 />
      <App parseWorker={workerInstance} />

    </>
  )
}

export default ExcelParsingPage;


