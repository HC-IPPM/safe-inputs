import React from 'react';

import './i18n'
import './App.css'
import { Box, Center } from '@chakra-ui/react';
import { useTranslation } from "react-i18next";

import TopHeader1 from './topHeader';

export default function SecondPage() {

    const { t } = useTranslation()

    return (
<<<<<<< HEAD
        <>
            <TopHeader1 />
            <header className="App-header">{t('second_page.header')}</header>
            <Box className="pagebody">
                <Box h='200px' bg='lightblue'><Center> {t('second_page.para1')}</Center> </Box>
                <Box h='200px' bg=''><Center> {t('second_page.para2')}</Center> </Box>
                <Box h='200px' bg='lightblue'><Center> {t('second_page.para3')}</Center> </Box>
            </Box>
=======
        <>           
            <Box h='200px' bg='lightblue'><Center> {t('second_page.para1')}</Center> </Box>
            <Box h='200px' bg=''><Center> {t('second_page.para2')}</Center> </Box>
            <Box h='200px' bg='lightblue'><Center> {t('second_page.para3')}</Center> </Box>
>>>>>>> 184e2365c977011adadca895e46b7aa17df4e943
        </>
    )
}

