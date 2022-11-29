import React, { useEffect, useState } from 'react'

import '../App.css'
import '../i18n'
import {
  HStack,
  Box,
  Image,
  Link,
  Button,
  Center,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Container,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FcMenu } from 'react-icons/fc'

export default function TopHeader() {
  const [windowDimenion, detectHW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  })

  const detectSize = () => {
    detectHW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    })
  }
  useEffect(() => {
    window.addEventListener('resize', detectSize)
    return () => {
      window.removeEventListener('resize', detectSize)
    }
  }, [windowDimenion])

  const { t, i18n } = useTranslation()
  const LanguageButtonStyle = {
    w: '20px',
    h: '30px',
    margin: '2',
    bg: 'transparent',
    outline: 'varient',
    color: '#333333',
    border: '1px',
    borderColor: '#333333',
    _hover: {
      color: '#FFFFFF',
      bg: '#26374A',
      textDecor: 'underline',
      borderColor: '#FFFFFF',
    },
  }

  // Function for the language Button.
  // Button will change the state of the Language from EN/FR. This will change the language displayed on the page. Languages are initially set by windows language detector
  function LanguageButton() {
    return (
      <>
        {i18n.language === 'en' ? (
          <>
            <Button
              {...LanguageButtonStyle}
              defaultValue={i18n.language}
              onClick={() => i18n.changeLanguage('fr')}
              as="button"
            >
              <Text>Fr</Text>
            </Button>
          </>
        ) : (
          <>
            <Button
              {...LanguageButtonStyle}
              defaultValue={i18n.language}
              onClick={() => i18n.changeLanguage('en')}
              as="button"
            >
              <Text>En</Text>
            </Button>
          </>
        )}
      </>
    )
  }

  return (
    <>
      <Box bg="#EEEEEE">
        <Container maxW="7xl" px={10} py={4}>
          <HStack justify="space-between">
            <Image
              src={t('safeInputs.image')}
              w="auto"
              h="auto"
              maxW={{ base: '200px', sm: '250px', md: '315px', lg: '350px' }}
              minW={{ base: '170px', sm: '215px', md: '260px', lg: '275px' }}
              alt={t('safeInputs.imageAlt')}
            />
            {/* MenuContent function above on line 112 */}
            <LanguageButton />
          </HStack>
        </Container>
      </Box>
    </>
  )
}
