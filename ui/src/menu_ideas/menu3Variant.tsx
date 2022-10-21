import React from "react";

import '../App.css'
import '../i18n'
import { HStack, Box, Image, Link, Button, useDisclosure, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Text, VStack, } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FcMenu } from "react-icons/fc";

export default function MenuIdea3Variant() {

    const { t, i18n } = useTranslation()
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Box  >
                <HStack justify={'space-around'} h='60px' className="pagebody" >
                    <Box></Box>{/* used to center the menu/hamburger, image, and translation */}
                    <Box >
                        <Button onClick={onOpen} as={Button} aria-label='Options' bg='transparent' color='gray' _hover={{ bg: 'transparent' }} _expanded={{ bg: 'grey.400' }}>
                            <HStack>
                                <Text className='menu'> Menu</Text>
                                <FcMenu />
                            </HStack>
                        </Button>
                        <Drawer isOpen={isOpen} placement='top' onClose={onClose} >
                            <DrawerOverlay />
                            <DrawerContent color='white'>
                                <DrawerCloseButton />
                                <DrawerHeader className="App-header" >Safe Input PoC</DrawerHeader>

                                <DrawerBody className="pagebody">
                                    <Box id='pageMarginSetting' >
                                        <HStack justify={'space-around'} fontSize={'sm'}>
                                            <VStack align={'left'} >
                                                <Text fontSize={'lg'}>Safe Input Sites</Text>
                                                <Link href='/' >{t("menu.home")}</Link>
                                                <Link href='/secondpage'> {t("menu.secondPage")}</Link>
                                                <Link href='/thirdpage'> {t("menu.thirdPage")}</Link>
                                            </VStack>
                                            <VStack align={'right'} >
                                                <Text fontSize={'lg'}>Commonly Visted</Text>
                                                <Link href='/' >{t("menu.home")}</Link>
                                                <Link href='/secondpage'> {t("menu.secondPage")}</Link>
                                                <Link href='/thirdpage'> {t("menu.thirdPage")}</Link>
                                            </VStack>
                                        </HStack>
                                    </Box>
                                </DrawerBody>

                                <DrawerFooter color='white' bg='grey' >
                                    <Box w='100%' fontSize={12}  >
                                        <HStack justify={'space-between'}>
                                            <Box />
                                            <Link href='/'>Social Media  </Link>
                                            <Link href='/'>Mobile Applications </Link>
                                            <Link href='/'>About Canada.ca </Link>
                                            <Link href='/'>Terms &amp; Conditions </Link>
                                            <Link href='/'>Privacy </Link>
                                            <Box />
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

                    <Image src={t('safeInputs.image')} w='auto' h='auto' maxW={{ base: '200px', sm: '250px', md: '300px', lg: '350px' }} />

                    <Box fontSize={{ base: '12px', md: '14px' }}  >
                        {i18n.language === 'en' ? (<><Link href='' defaultValue={i18n.language} onClick={() => i18n.changeLanguage('fr')}
                        > Français</Link></>) : (<><Link href='' defaultValue={i18n.language} onClick={() => i18n.changeLanguage('en')}
                        >English</Link> </>)}
                    </Box>
                    <Box></Box>{/* used to center the menu/hamburger, image, and translation */}
                </HStack>

            </Box>
        </>
    )
}