import React from 'react';

import '../i18n'
import '../App.css'
import { Box, Flex, VStack } from '@chakra-ui/react';
import { useTranslation } from "react-i18next";


export default function SecondPage() {

    const { t } = useTranslation()
    const boxStyle = { background: 'transparent', className: "pagebody", id: 'pageMarginSetting', width: '100%', justifyContent: 'justify' }

    return (
        <>
            <Box className="App-header" mb={2}>{t('secondPage.header')}</Box>

            <VStack >
                <Flex bg='' w='100%' >
                    <Box  {...boxStyle} >{t('secondPage.para1')}</Box>
                </Flex>
                <Flex bg='lightblue' w='100%'>
                    <Box {...boxStyle} textAlign='center'>{t('secondPage.para2')}</Box>
                </Flex>
                <Flex bg='' w='100%'>
                    <Box {...boxStyle} textAlign='right'>{t('secondPage.para3')}</Box>
                </Flex>
            </VStack>
        </>
    )
}

