import React from 'react';

import '../i18n'
import '../App.css'
import { Box, Center, Flex, VStack } from '@chakra-ui/react';
import { useTranslation } from "react-i18next";

import TopHeader1 from '../topHeader';

export default function ThirdPage() {

    const { t } = useTranslation()

    const boxStyle = {background: 'transparent', className:"pagebody", id:'pageMarginSetting', width: '100%', justifyContent: 'justify' }

    return (
        <>
            <TopHeader1 />
            <Box className="App-header" mb={2}>{t('third_page.header')}</Box>

            <VStack>
                <Flex bg='' w='100%'>
                    <Box  {...boxStyle} >{t('third_page.para1')}</Box>
                </Flex>
                <Flex bg='lightblue' w='100%'>
                    <Box {...boxStyle} >{t('third_page.para2')}</Box>
                </Flex>
                <Flex bg='' w='100%'>
                    <Box {...boxStyle} >{t('third_page.para3')}</Box>
                </Flex>
            </VStack>
        </>
    )
}

