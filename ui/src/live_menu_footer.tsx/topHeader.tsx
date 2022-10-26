import React from 'react';

import '../App.css'
import '../i18n'
import { HStack, Box, Image, Text, Link } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";


export default function TopHeader1() {

    const { t, i18n } = useTranslation()

    return (
        <>
            <nav>
                <Box >
                    <HStack justify={'space-around'} h='60px' className="pagebody" id='pageMarginSetting'>
                        <Box></Box>
                        <Image src={t('safeInputs.image')} w='auto' h='auto' maxW={{ base: '200px', sm: '250px', md: '300px', lg: '350px' }} />

                        <Box h={{ base: '30px', md: '45px' }} >
                            {i18n.language === 'en' ? (<><Link href='' defaultValue={i18n.language} onClick={() => i18n.changeLanguage('fr')}
                            > <Text className="translationButton">Français</Text></Link></>) : (<><Link href='' defaultValue={i18n.language} onClick={() => i18n.changeLanguage('en')}
                            ><Text className="translationButton">English</Text></Link> </>)}
                        </Box>
                    </HStack>
                    <Box bg='#e4e2e0' >
                        <Box id='pageMarginSetting' bg='transparent' padding={'6px 8px'} fontFamily="Noto Sans" >
                            <HStack gap={3} fontFamily={"Noto Sans"} fontSize='19px' lineHeight='1.4375' h='40px' color='#0B0C0C'>
                                <Box >
                                    <Link href='/' ><Text className='menu'>{t("menu.home")}</Text></Link>
                                </Box><Box >
                                    <Link href='/secondpage'><Text className='menu'>{t("menu.secondPage")}</Text></Link>
                                </Box><Box>
                                    <Link href='/thirdpage'><Text className='menu'>{t("menu.thirdPage")}</Text></Link>
                                </Box>
                            </HStack>
                        </Box>
                    </Box>
                </Box>
            </nav>
            <Outlet />
        </>
    )
}