import React, { useEffect, useState } from 'react'

import '../../App.css'
import '../../i18n'
import {
  HStack,
  Container,
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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FcMenu } from 'react-icons/fc'

import TermsConditions from '../../pages/termsConditions'

export default function TopHeaderModified() {
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
    bg: 'transparent',
    color: '#333333',
    _hover: {
      color: '#0000FF',
      textDecor: 'underline',
      borderColor: '#FFFFFF',
    },
  }

  const homePage = (
    <Link href="/pagefour" w="auto">
      <Text
        fontSize={{
          base: '18px',
          sm: '15px',
          md: '17px',
          lg: '17px',
          xl: '18px',
        }}
        fontFamily="sans-serif"
      >
        pagefour
      </Text>
    </Link>
  )
  const secondPage = (
    <Link href="" w="auto">
      <Text
        fontSize={{
          base: '18px',
          sm: '15px',
          md: '17px',
          lg: '17px',
          xl: '18px',
        }}
        fontFamily="sans-serif"
        w="auto"
      >
        Why Safe Inputs PoC
      </Text>
    </Link>
  )
  const thirdPage = (
    <Link href="">
      <Text
        fontSize={{
          base: '18px',
          sm: '15px',
          md: '17px',
          lg: '17px',
          xl: '18px',
        }}
        fontFamily="sans-serif"
      >
        Features
      </Text>
    </Link>
  )
  const fourthPage = (
    <Link href="">
      <Text
        fontSize={{
          base: '18px',
          sm: '15px',
          md: '17px',
          lg: '17px',
          xl: '18px',
        }}
        fontFamily="sans-serif"
      >
        API Documentation
      </Text>
    </Link>
  )

  // Function for the language Button.
  // Button will change the state of the Language from EN/FR. This will change the language displayed on the page. Languages are initially set by windows language detector
  function LanguageButton() {
    return (
      <>
        {i18n.language === 'en' ? (
          <>
            <Link
              {...LanguageButtonStyle}
              defaultValue={i18n.language}
              onClick={() => i18n.changeLanguage('fr')}
              as="button"
            >
              <Text>Français</Text>
            </Link>
          </>
        ) : (
          <>
            <Link
              {...LanguageButtonStyle}
              defaultValue={i18n.language}
              onClick={() => i18n.changeLanguage('en')}
              as="button"
            >
              <Text>English</Text>
            </Link>
          </>
        )}
      </>
    )
  }

  function LargeMenu() {
    return (
      <>
        {windowDimenion.winWidth > 768 ? (
          <>
            <Flex bg="" w="full" py={3}>
              <Container maxW="7xl" px={10}>
                <Text fontSize="calc(10px + 2vmin)">Safe Inputs PoC </Text>
              </Container>
            </Flex>

            <Flex bg="#E8DCB899 " w="full" py={2}>
              <Container maxW="8xl" px={10}>
                <Tabs bg="#f4f0e8" variant="enclosed">
                  <TabList
                    pl="12"
                    gap={9}
                    fontSize={{
                      base: '18px',
                      sm: '15px',
                      md: '17px',
                      lg: '17px',
                      xl: '18px',
                    }}
                    fontFamily="sans-serif"
                  >
                    <Tab
                      _selected={{
                        outline: 'variant',
                        bg: '#BBBBBB',
                        boxShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px',
                      }}
                    >
                      Safe inputs PoC
                    </Tab>

                    <Tab
                      _selected={{
                        outline: 'variant',
                        bg: '#BBBBBB',
                        boxShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px',
                      }}
                    >
                      Two
                    </Tab>
                    <Tab
                      _selected={{
                        outline: 'variant',
                        bg: '#BBBBBB',
                        boxShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px',
                      }}
                    >
                      Three
                    </Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      <TermsConditions />
                    </TabPanel>
                    <TabPanel>
                      <p>two!</p>
                    </TabPanel>
                    <TabPanel>
                      <p>three!</p>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
                <HStack gap={1}>
                  <Box>{homePage}</Box>
                  <Box>{secondPage}</Box>
                  <Box>{thirdPage}</Box>
                  <Box>{fourthPage}</Box>
                </HStack>
              </Container>
            </Flex>
          </>
        ) : (
          <> </>
        )}
      </>
    )
  }

  // Menu Content is base on display size. Menu will be colapse to a hamburger dropdown menu if display width is smaller than 768 pixels.
  function DropMenuContent() {
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
                  <MenuItem>{fourthPage}</MenuItem>
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
      <Box bg="#FFFFFF" role={''}>
        <Container maxW="7xl" px={10}>
          <Flex
            w="100%"
            flex={1}
            justify={'space-between'}
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
                returnNull={false}
              />
            </Box>
            <Box id="pageMarginSetting">
              {/* MenuContent function above on line 112 */}
              <DropMenuContent />
            </Box>
          </Flex>
        </Container>
      </Box>
      <Box bg="#FFFFFF" role={''}>
        <LargeMenu />
      </Box>
    </>
  )
}
