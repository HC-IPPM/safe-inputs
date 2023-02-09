import React, { useEffect, useState } from 'react'

import '../App.css'
import '../i18n'
import { HStack, Box, Button, Text, Container, Link } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { WordMark } from '../components/wordmarks'

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
        <Container maxW="7xl" px={{ base: 5, md: 10 }} py={4}>
          <HStack justify="space-between">
            <Link
              bg="transparent"
              h="auto"
              _hover={{
                bg: 'transparent',
              }}
              maxW={{ base: '250px', sm: '300px', md: '365px', lg: '400px' }}
              minW={{ base: '180px', sm: '265px', md: '400px', lg: '365px' }}
              href="/"
            >
              {i18n.language === 'en' ? (
                <WordMark lang={'en'} textColor={'black'} />
              ) : (
                <WordMark lang={'fr'} textColor={'black'} />
              )}
            </Link>
            {/* MenuContent function above on line 112 */}
            <HStack>
              <Link href="/">{t('menu.home')}</Link>
              <LanguageButton />{' '}
            </HStack>
          </HStack>
        </Container>
      </Box>
    </>
  )
}
