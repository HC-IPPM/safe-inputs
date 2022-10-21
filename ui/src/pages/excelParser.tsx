import React, { } from 'react'

import { ChevronUpIcon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'

import '../App.css'
import App from '../App'
import { ParseWorker } from '../serviceWorker'
import workerInstance from '../serviceWorker'

function ExcelParsingPage({ parseWorker }: { parseWorker: ParseWorker }) {

  return (
    <>
      <App parseWorker={workerInstance} />
      <Button position='fixed' padding='1px 2px' fontSize='20px' bottom='10px' left='90px'
        backgroundColor='#284162' color='#fff' textAlign='center'
        onClick={() => { window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); }} >
        <ChevronUpIcon />  </Button>
    </>
  )
}

export default ExcelParsingPage;


