import React from 'react';

import './i18n'
import { HStack, Box, Image, Text, Link } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FcHome } from "react-icons/fc";



export default function TopHeader1() {

    const { t, i18n } = useTranslation()

    return (
        <>
            <Box >
                <HStack justify={'space-around'} h='60px' className="pagebody">
                    <Box></Box>
                    <Image src={t('safe_inputs.image')} w={{base:'300px', md: '400px' }} min-width={'200px'} />
                    <Box fontSize={{base:'10px', md: '14px' }} h={{base:'30px', md: '45px' }} >                        
                            {i18n.language === 'en' ? (<><Link href='' color='blue' defaultValue={i18n.language} onClick={() => i18n.changeLanguage('fr')}
                        > Français</Link></>) : (<><Link href='' color='blue' defaultValue={i18n.language} onClick={() => i18n.changeLanguage('en')}
                        >English</Link> </>)} 
                     
                       
                    </Box>
                </HStack>
                <HStack justify={'space-around'} bg='gray.300'>
                    <Box></Box>
                    <Link href='/' ><HStack><FcHome /><Text>{t("menu.home")}</Text></HStack></Link>
                    <Link href='/secondpage'> {t("menu.secondPage")}</Link>
                    <Box></Box>
                </HStack>
            </Box>
        </>
    )
}