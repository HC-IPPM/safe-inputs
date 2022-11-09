import React, { useEffect, useState } from 'react'

import '../App.css'
import '../i18n'
import {
  HStack,
  Box,
  Image,
  Link,
  Button,
  Flex,
  Center,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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

  const homePage = (
    <Link href="/" w="auto">
      <Text className="menu">{t('menu.home')}</Text>
    </Link>
  )
  const secondPage = (
    <Link href="/secondpage" w="auto">
      <Text className="menu" w="auto">
        {t('menu.secondPage')}
      </Text>
    </Link>
  )
  const thirdPage = (
    <Link href="/thirdpage">
      <Text className="menu">{t('menu.thirdPage')}</Text>
    </Link>
  )

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

  // Menu Content is base on display size. Menu will be colapse to a hamburger dropdown menu if display width is smaller than 768 pixels.
  function MenuContent() {
    return (
      <>
        {windowDimenion.winWidth > 768 ? (
          // Start of displays displays larger than 768 pixels in width
          <>
            <HStack
              w="325px"
              h="52px"
              justify={'end'}
              align="center"
              textAlign={'center'}
            >
              <Box>{homePage}</Box>
              <Box>{secondPage}</Box>
              <Box>{thirdPage}</Box>
              {/* LanguageButton function above on line 79 */}
              <LanguageButton />
            </HStack>
          </>
        ) : (
          // End of displayslarger than 768 pixels in width
          // Start of displays smaller than 768 pixels in width
          <>
            <HStack>
              <Menu>
                <MenuButton
                  as={Button}
                  aria-label="Options"
                  bg="transparent"
                  color="black"
                  _hover={{ bg: 'transparent' }}
                  _expanded={{ bg: 'transparent' }}
                  h="calc(12px + 2vmin)"
                  minH="20px"
                  w="calc(12px + 2vmin)"
                  minW="20px"
                >
                  <Center color="black">
                    <Text>
                      <FcMenu />
                    </Text>
                  </Center>
                </MenuButton>
                <MenuList>
                  <MenuItem>{homePage}</MenuItem>
                  <MenuItem>{secondPage}</MenuItem>
                  <MenuItem>{thirdPage}</MenuItem>
                </MenuList>
              </Menu>
              <Box>
                {/* LanguageButton function above on line 79 */}
                <LanguageButton />
              </Box>
            </HStack>
          </>
          // End of displays smaller than 768 pixels in width
        )}
      </>
    )
  }
  return (
    <>
      <Box bg="#EEEEEE"
      role={''}>
        <Flex
          w="100%"
          flex={1}
          justify={'space-between'}
          className="pagebody"
          id="pageMarginSetting"
          align="center"
          as="header"
        >
          <Box w="100%">
            <Image
              src={t('safeInputs.image')}
              w="auto"
              h="auto"
              maxW={{ base: '200px', sm: '250px', md: '315px', lg: '350px' }}
              minW={{ base: '170px', sm: '215px', md: '260px', lg: '275px' }}
              alt={t('safeInputs.imageAlt')}
            />
          </Box>
          <Box id="pageMarginSetting">
            {/* MenuContent function above on line 112 */}
            <MenuContent />
          </Box>
        </Flex>
      </Box>
    </>
  )
}
