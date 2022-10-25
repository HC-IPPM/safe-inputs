import React, { useEffect, useState } from 'react';

import '../App.css'
import '../i18n'
import { HStack, Box, Image, Link, Button, Flex, Center, Text, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FcMenu } from 'react-icons/fc';


export default function MenuIdea1SecondVariant() {
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
    const LanguageButton = { w:'20px',h: '30px', bg: 'transparent', outline: 'varient', color: 'black', border: '1px', _hover: { color: '#ffffff', bg: '#202020', textDecor: 'underline', borderColor: '#ffffff' } }
    // h: 'calc(12px + 2vmin)', minH: '20px', w: 'calc(12px + 2vmin)', minW: '20px',
    const homePage = <Link href='/' w='auto'><Text className='menu' >{t("menu.home")}</Text></Link>
    const secondPage = <Link href='/secondpage' w='auto'><Text className='menu' w='auto'>{t("menu.secondPage")}</Text></Link>
    const thirdPage = <Link href='/thirdpage'><Text className='menu'>{t("menu.thirdPage")}</Text></Link>
    function Menu1SecondVariant() {
        return (
            <>
                {windowDimenion.winWidth > 768 ? (
                    <>
                        <HStack w='300px' justify={'center'} align='center'>
                            <Box>
                                {homePage}
                            </Box>
                            <Box >
                                {secondPage}
                            </Box>
                            <Box >
                                {thirdPage}
                            </Box>
                            <Flex flex={1} align='center' justify={'center'}>                                
                                    {i18n.language === 'en' ? (<><Link href='' defaultValue={i18n.language} onClick={() => i18n.changeLanguage('fr')}
                                    > <Button {...LanguageButton}><Text>Fr</Text></Button></Link></>) : (<><Link href='' defaultValue={i18n.language} onClick={() => i18n.changeLanguage('en')}
                                    ><Button {...LanguageButton}><Text>En</Text></Button></Link> </>)}                                
                            </Flex>
                        </HStack>
                    </>) : (<>
                        <HStack >
                            <Menu>
                                <MenuButton as={Button} aria-label='Options' bg='transparent' color='black' _hover={{ bg: 'transparent' }} _expanded={{ bg: 'transparent' }}
                                    h='calc(12px + 2vmin)' minH='20px' w='calc(12px + 2vmin)' minW='20px'>
                                    <Center color='black'><Text><FcMenu /></Text></Center>
                                </MenuButton>
                                <MenuList>
                                    <MenuItem >
                                        {homePage}
                                    </MenuItem>
                                    <MenuItem >
                                        {secondPage}
                                    </MenuItem>
                                    <MenuItem >
                                        {thirdPage}
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                            <Box  >
                                {i18n.language === 'en' ? (<><Link href='' defaultValue={i18n.language} onClick={() => i18n.changeLanguage('fr')}
                                > <Button {...LanguageButton}><Text>Fr</Text></Button></Link></>) : (<><Link href='' defaultValue={i18n.language} onClick={() => i18n.changeLanguage('en')}
                                ><Button {...LanguageButton}><Text>En</Text></Button></Link> </>)}
                            </Box>
                        </HStack>
                    </>)}
            </>
        )
    }
    return (
        <>
            <Box bg='#EEEEEE'>
                <Flex w='100%' flex={1} justify={'space-between'} className="pagebody" id='pageMarginSetting' padding={'6px 8px'} align='center'
                    as="header" >
                    <Box w='100%'   >
                        <Image src={t('safeInputs.image')} w='auto' h='auto' maxW={{ base: '200px', sm: '250px', md: '300px', lg: '350px' }} />
                    </Box>
                    <Box id='pageMarginSetting' bg='transparent' fontFamily="Noto Sans" >

                        <Menu1SecondVariant />

                    </Box>
                </Flex>
            </Box>


        </>
    )
}