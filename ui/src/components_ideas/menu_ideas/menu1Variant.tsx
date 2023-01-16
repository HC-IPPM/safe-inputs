import React from 'react'

import '../../App.css'
import '../../i18n'
import {
  HStack,
  Box,
  Image,
  Link,
  Button,
  Flex,
  Text,
  Drawer,
  useDisclosure,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  VStack,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FcMenu } from 'react-icons/fc'

export default function MenuIdea1Variant() {
  const { t, i18n } = useTranslation()
  const LanuageButton = {
    h: '30px',
    w: '30px',
    bg: 'transparent',
    outline: 'varient',
    color: 'black',
    border: '1px',
    _hover: {
      color: '#ffffff',
      bg: '#202020',
      textDecor: 'underline',
      borderColor: '#ffffff',
    },
  }
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Box bg="#EEEEEE">
        <Flex
          w="100%"
          flex={1}
          justify={'space-between'}
          className="pagebody"
          id="pageMarginSetting"
          padding={'6px 8px'}
          align="center"
          as="header"
        >
          <Box w="100%">
            <Image
              src={t('safeInputs.image')}
              w="auto"
              h="auto"
              maxW={{ base: '200px', sm: '250px', md: '300px', lg: '350px' }}
              returnNull={false}
            />
          </Box>
          <Box id="pageMarginSetting" bg="transparent" fontFamily="Noto Sans">
            <HStack
              gap={3}
              fontFamily={'Noto Sans'}
              fontSize="19px"
              color="#0B0C0C"
            >
              <Box>
                <Button
                  onClick={onOpen}
                  as={Button}
                  aria-label="Options"
                  bg="transparent"
                  color="gray"
                  _hover={{ bg: 'transparent' }}
                  _expanded={{ bg: 'grey.400' }}
                  className="menu"
                >
                  <FcMenu />
                </Button>
                <Drawer
                  isOpen={isOpen}
                  placement="right"
                  onClose={onClose}
                  size={'sm'}
                >
                  <DrawerOverlay />
                  <DrawerContent color="white">
                    <DrawerCloseButton />
                    <DrawerHeader className="App-header">
                      Safe Input PoC
                    </DrawerHeader>

                    <DrawerBody className="pagebody">
                      <VStack align={'left'}>
                        <Link href="/">{t('menu.home')}</Link>
                        <Link href="/secondpage"> {t('menu.secondPage')}</Link>
                        <Link href="/thirdpage"> {t('menu.thirdPage')}</Link>
                      </VStack>
                    </DrawerBody>

                    <DrawerFooter color="white" bg="grey">
                      <Box w="100%" fontSize={12}>
                        <HStack justify={'space-between'}>
                          <Text>Social Media </Text>
                          <Text>Mobile Applications </Text>
                          <Text>About Canada.ca </Text>
                        </HStack>
                        <HStack justify={'space-around'}>
                          <Text>Terms &amp; Conditions </Text>
                          <Text>Privacy </Text>
                        </HStack>

                        {/* second option 
                                        <HStack justify={'space-between'}> <Text>Social Media  </Text> <Text>Mobile Applications </Text> </HStack>
                                        <HStack justify={'space-between'}> <Text>About Canada.ca </Text> <Text>Terms &amp; Conditions </Text> </HStack>
                                        <HStack justify={'left'}> <Text>Privacy </Text> </HStack>
                                        */}
                      </Box>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </Box>

              <Box>
                {i18n.language === 'en' ? (
                  <>
                    <Link
                      href=""
                      defaultValue={i18n.language}
                      onClick={() => i18n.changeLanguage('fr')}
                    >
                      {' '}
                      <Button {...LanuageButton}>Fr</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href=""
                      defaultValue={i18n.language}
                      onClick={() => i18n.changeLanguage('en')}
                    >
                      <Button {...LanuageButton}>En</Button>
                    </Link>{' '}
                  </>
                )}
              </Box>
            </HStack>
          </Box>
        </Flex>
      </Box>
    </>
  )
}
