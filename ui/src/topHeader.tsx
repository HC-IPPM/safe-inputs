import React from 'react';

import './i18n'

import { HStack, Box, Image, Text, VStack,} from "@chakra-ui/react";
import styled from '@emotion/styled'
import { useTranslation } from "react-i18next";
import { FcHome } from "react-icons/fc";
import { Link } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { availableLanguages } from "./i18n";

export default function TopHeader1() {
    
    const Section = styled.section`
    color: #000000;
  `
    const { t, i18n } = useTranslation()
 

    return (
        <>
        <Section>
            <Box>
                <HStack justify={'space-around'} h='60px'>
                    <Box></Box>
                    <Image src={t('safe_inputs.image')} w='400px' />
                    <Box justifyContent={'baseline'} h='50px'>

                        {i18n.language === 'en' ? (<><Link to='' color='blue' defaultValue={i18n.language} onClick={() => i18n.changeLanguage('fr')}
                        > Français</Link></>) : (<><Link to='' color='blue' defaultValue={i18n.language} onClick={() => i18n.changeLanguage('en')}
                        >English</Link> </>)}
                    </Box>


                </HStack>

                <HStack justify={'space-around'} bg='gray.300' >
                    <Box></Box>
                    <Link to='/' ><HStack><FcHome /><Text>{t("menu.home")}</Text></HStack></Link>
                    <Link to='/secondPage'> {t("menu.secondPage")}</Link>
                    <Box></Box>
                </HStack>
              

            </Box>
            </Section>
        </>
    )
}