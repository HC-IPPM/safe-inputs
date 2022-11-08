import React from 'react'

import '../App.css'
import App from '../App'
import { ParseWorker } from '../serviceWorker'
import workerInstance from '../serviceWorker'

function ExcelParsingPage({ parseWorker }: { parseWorker: ParseWorker }) {
  return (
    <>
      <App parseWorker={workerInstance} />
    </>
  )
}

export default ExcelParsingPage
