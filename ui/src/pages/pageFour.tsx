/* eslint-disable import/order */
import React from "react";

import '../i18n'
import '../App.css'
import { Box, VStack, Flex, Center, Image, Text, Textarea } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import MenuIdea1 from "../menu_ideas/menu1";
import MenuIdea2 from "../menu_ideas/menu2";
import TopHeader1 from "../topHeader";
import MenuIdea3 from "../menu_ideas/menu3";
import MenuIdea3Variant from "../menu_ideas/menu3Variant";
import TopHeader2Variant from "../menu_ideas/menu1Variant";
import Footer from "../menu_ideas/footer";
import MenuIdea4 from "../menu_ideas/menu4";



export default function PageFour() {

    const { t } = useTranslation()

    function TestPage() {
        const boxStyle = { background: 'transparent', className: "pagebody", id: 'pageMarginSetting', width: '100%', justifyContent: 'justify' }

        return (<><Box className="App-header" mb={2}>
            <header>{t('secondPage.header')}</header></Box>
            <VStack>
                <Flex bg='' w='100%'>
                    <Box  {...boxStyle} ><Text>{t('secondPage.para1')} </Text></Box>
                </Flex>
                <Flex bg='lightblue' w='100%'>
                    <Box {...boxStyle} ><Text>{t('secondPage.para2')}</Text></Box>
                </Flex>
                <Flex w='100%' >
                    <Box {...boxStyle}><Text>{t('secondPage.para3')}</Text></Box>
                </Flex>
            </VStack></>)
    }

    function PageBreak() {
        return (
            <>
                <br /><br /><br />
                <Box h='5px' />
                <Box h='5px' bg='black' />
                <Box h='5px' />
                <br /><br /><br />
            </>
        )
    }

    return (
        <>
            <Center bg='gray' color='yellow'>Currently Live </Center>
            <TopHeader1 />
            <TestPage />
            <PageBreak />

            <Center bg='gray' color='yellow'>Option 1 - menu moved to beside fr/en</Center>
            <MenuIdea1 />
            <TestPage />
            <PageBreak />

            <Center bg='gray' color='yellow'>Option 1 - menu moved to beside fr/en, hamburger menu</Center>
            <TopHeader2Variant />
            <TestPage />
            <PageBreak />


            <Center bg='gray' color='yellow'>Option 2 - drop down </Center>
            <MenuIdea2 />
            <TestPage />
            <PageBreak />

            <Center bg='gray' color='yellow'>Option 3 - Drawer menu left </Center>
            <MenuIdea3 />
            <TestPage />
            <PageBreak />

            <Center bg='gray' color='yellow'>Option 3 - Drawer menu top </Center>
            <MenuIdea3Variant />
            <TestPage />
            <PageBreak />

            {/* <Center bg='gray' color='yellow'>Option 4 - classic style (incomplete) </Center>
            <MenuIdea4 />
            <TestPage />
            <PageBreak />   */}

            <Footer />
            <br></br>

        </>
    )
}