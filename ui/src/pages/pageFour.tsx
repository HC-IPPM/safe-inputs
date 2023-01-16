/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
import React from 'react'

import '../i18n'
import '../App.css'
import {
  Box,
  VStack,
  Flex,
  Center,
  Text,
  Container,
  Divider,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import MenuIdea1 from '../components_ideas/menu_ideas/menu1'
import MenuIdea2 from '../components_ideas/menu_ideas/menu2'
import MenuIdea3 from '../components_ideas/menu_ideas/menu3'
import MenuIdea3Variant from '../components_ideas/menu_ideas/menu3Variant'
import MenuIdea4 from '../components_ideas/menu_ideas/menu4'
import MenuIdea1SecondVariant from '../components_ideas/menu_ideas/menu1SecondVariant'
import MenuIdea1Variant from '../components_ideas/menu_ideas/menu1Variant'
import TopHeader from '../live_menu_footer.tsx/topHeader'
import FooterIdea1 from '../components_ideas/footer_ideas/footer1'
import TopHeaderModified from '../components_ideas/menu_ideas/topHeaderModified'

export default function PageFour() {
  const { t } = useTranslation()

  function TestPage() {
    return (
      <>
        <Box className="App-header" mb={2}>
          {t('secondPage.header')}
        </Box>
        <Flex bg="" w="full" py={3}>
          <Container maxW="7xl" 
           px={10}
          >
            <Text>{t('thirdPage.para1')} </Text>
          </Container>
        </Flex>
        <Flex bg="lightblue" w="full" py={3}>
          <Container maxW="7xl" px={10}>
            <Text>{t('thirdPage.para2')}</Text>
          </Container>
        </Flex>
        <Flex bg="" w="full" py={3}>
          <Container maxW="7xl" px={10}>
            <Text>
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
              condimentum venenatis felis at consectetur. Vivamus commodo
              volutpat quam, fringilla consectetur arcu ultricies at. Vivamus
              non enim ex. Nulla ultricies semper sem, a accumsan mauris luctus
              laoreet. Quisque commodo facilisis scelerisque. Vestibulum non
              sapien commodo, viverra urna vel, vestibulum risus. Aliquam nibh
              nisi, maximus nec lorem a, eleifend tempus justo. Pellentesque
              sodales, erat quis aliquam iaculis, arcu ligula dignissim orci,
              sed viverra nibh dolor iaculis risus. Quisque sodales elit id
              tellus pretium faucibus. Ut vel tincidunt purus. Praesent nec elit
              venenatis, luctus tellus non, tristique turpis. Aliquam viverra
              massa vel pharetra viverra. "
            </Text>
            <br />
            <Text>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
              condimentum venenatis felis at consectetur. Vivamus commodo
              volutpat quam, fringilla consectetur arcu ultricies at. Vivamus
              non enim ex. Nulla ultricies semper sem, a accumsan mauris luctus
              laoreet. Quisque commodo facilisis scelerisque. Vestibulum non
              sapien commodo, viverra urna vel, vestibulum risus. Aliquam nibh
              nisi, maximus nec lorem a, eleifend tempus justo. Pellentesque
              sodales, erat quis aliquam iaculis, arcu ligula dignissim orci,
              sed viverra nibh dolor iaculis risus. Quisque sodales elit id
              tellus pretium faucibus. Ut vel tincidunt purus. Praesent nec elit
              venenatis, luctus tellus non, tristique turpis. Aliquam viverra
              massa vel pharetra viverra. "
            </Text>
          </Container>
        </Flex>
      </>
    )
  }

  function PageBreak() {
    return (
      <>
        <br />
        <br />
        <br />
        <Box h="5px" />
        <Box h="5px" bg="black" />
        <Box h="5px" />
        <br />
        <br />
        <br />
      </>
    )
  }

  return (
    <>
      {/* <Center bg="gray" color="yellow">
        Currently Live{' '}
      </Center>
      <TopHeader />
      <TestPage />
       <PageBreak /> 

       <Center bg="gray" color="yellow">
        Option 1 - menu moved to beside fr/en
      </Center>
      <MenuIdea1 />
      <TestPage />
      <PageBreak />

      <Center bg="gray" color="yellow">
        Option 1 - collapsing menu by media size with dropdown menu{' '}
      </Center>
      <MenuIdea1SecondVariant />
      <TestPage />
      <PageBreak />

      <Center bg="gray" color="yellow">
        Option 1 - menu moved to beside fr/en, hamburger menu
      </Center>
      <MenuIdea1Variant />
      <TestPage />
      <PageBreak />

      <Center bg="gray" color="yellow">
        Option 2 - drop down{' '}
      </Center>
      <MenuIdea2 />
      <TestPage />
      <PageBreak />

      <Center bg="gray" color="yellow">
        Option 3 - Drawer menu right{' '}
      </Center>
      <MenuIdea3 />
      <TestPage />
      <PageBreak />

      <Center bg="gray" color="yellow">
        Option 3 - Drawer menu top{' '}
      </Center>
      <MenuIdea3Variant />
      <TestPage />
      <PageBreak />

      <Center bg="gray" color="yellow">
        Option 4 - classic style (incomplete){' '}
      </Center>
      <MenuIdea4 />
      <TestPage />
      <PageBreak /> */}

      <TopHeaderModified />

      <TestPage />

      <FooterIdea1 />
    </>
  )
}
