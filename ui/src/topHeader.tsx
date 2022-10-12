import React from 'react';

import './App.css'
import './i18n'
import { HStack, Box, Image, Text, Link } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";


export default function TopHeader1() {

    const { t, i18n } = useTranslation()

    return (
        <>
            <Box >
                <HStack justify={'space-around'} h='60px' className="pagebody" id='pageMarginSetting'>
                    <Box></Box>
                    <Image src={t('safeInputs.image')} w={{ base: '300px', md: '400px' }} min-width={'200px'} />
                    <Box fontSize={{ base: '12px', md: '14px' }} h={{ base: '30px', md: '45px' }} >
                        {i18n.language === 'en' ? (<><Link href='' defaultValue={i18n.language} onClick={() => i18n.changeLanguage('fr')}
                        > Français</Link></>) : (<><Link href='' defaultValue={i18n.language} onClick={() => i18n.changeLanguage('en')}
                        >English</Link> </>)}
                    </Box>
                </HStack>
                <Box bg='#EEEEEE' >
                    <Box id='pageMarginSetting' bg='transparent' padding={'6px 8px'} fontFamily="Noto Sans" >
                        <HStack gap={3} fontFamily={"Noto Sans"} fontSize='19px' lineHeight='1.4375' h='40px' color='#0B0C0C'>
                            <Box >
                                <Link href='/' >{t("menu.home")}</Link>
                            </Box><Box >
                                <Link href='/secondpage'> {t("menu.secondPage")}</Link>
                            </Box><Box>
                                <Link href='/thirdpage'> {t("menu.thirdPage")}</Link>
                            </Box>
                        </HStack>
                    </Box>
                </Box>
            </Box>
        </>
    )
}