import React from 'react'

import { ChevronUpIcon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'

export default function ScrollToTopButton() {
  return (
    <Button
      position="fixed"
      padding="1px 2px"
      fontSize="20px"
      bottom="10px"
      left="90px"
      backgroundColor="#284162"
      color="#fff"
      textAlign="center"
      onClick={() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      }}
    >
      <ChevronUpIcon />{' '}
    </Button>
  )
}
