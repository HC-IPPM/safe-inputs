import React from 'react';

import '../App.css'
import '../i18n'
import { HStack, Box, Image, Link, Button, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";


export default function MenuIdea1() {

    const { t, i18n } = useTranslation()
    const LanuageButton = { h: 'calc(12px + 2vmin)', minH: '20px', w: 'calc(12px + 2vmin)', minW: '20px', bg: 'transparent', outline: 'varient', color: 'black', border: '1px', _hover: { color: '#ffffff', bg: '#202020', textDecor: 'underline', borderColor: '#ffffff' } }

    return (
        <>
            <Box bg='#EEEEEE'>
            <Flex w='100%' flex={1} justify={'space-between'} className="pagebody" id='pageMarginSetting' padding={'6px 8px'} align='center'
                    as="header" >
                    <Box w='100%'   >                        
                        <Image src={t('safeInputs.image')} w='auto' h='auto' maxW={{ base: '200px', sm: '250px', md: '300px', lg: '350px' }} />
                    </Box>
                    <Box id='pageMarginSetting' bg='transparent' fontFamily="Noto Sans" >
                        <HStack w='280px' fontFamily={"Noto Sans"}  >
                            <Box >
                                <Link href='/' ><Text className='menu'>{t("menu.home")}</Text></Link>
                            </Box><Box >
                                <Link href='/secondpage'><Text className='menu'>{t("menu.secondPage")}</Text></Link>
                            </Box><Box>
                                <Link href='/thirdpage'> <Text className='menu'>{t("menu.thirdPage")}</Text></Link>
                            </Box>
                            <Box  >
                                {i18n.language === 'en' ? (<><Link href='' defaultValue={i18n.language} onClick={() => i18n.changeLanguage('fr')}
                                > <Button {...LanuageButton}><Text>Fr</Text></Button></Link></>) : (<><Link href='' defaultValue={i18n.language} onClick={() => i18n.changeLanguage('en')}
                                ><Button {...LanuageButton}><Text>En</Text></Button></Link> </>)}
                            </Box>
                        </HStack>
                    </Box>
                </Flex>
            </Box>

            
        </>
    )
}