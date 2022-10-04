import React from 'react';

import './i18n'

import { Box, Center } from '@chakra-ui/react';
import { useTranslation } from "react-i18next";


import TopHeader1 from "./topHeader";

export default function SecondPage() {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { t, i18n } = useTranslation()


    return (
        <>
        <TopHeader1 />
        <header className="App-header"> {t("secondPage.header")}</header>
        <Box h='200px' bg='lightblue'><Center> {t('secondPage.para1')}</Center> </Box>
        <Box h='200px' bg=''><Center> {t('secondPage.para2')}</Center> </Box>        
        <Box h='200px' bg='lightblue'><Center> {t('secondPage.para3')}</Center> </Box>

        </>
    )
}

