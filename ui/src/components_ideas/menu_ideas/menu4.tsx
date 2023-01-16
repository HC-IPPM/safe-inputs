import React from 'react'

import '../../App.css'
import '../../i18n'
import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  Link,
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Text,
  Image,
  Button,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export default function MenuIdea4() {
  const { t, i18n } = useTranslation()
  const LanguageButton = {
    h: 'calc(12px + 2vmin)',
    minH: '20px',
    w: 'calc(12px + 2vmin)',
    minW: '20px',
    bg: 'transparent',
    outline: 'varient',
    color: 'black',
    border: '1px',
    _hover: {
      color: '#ffffff',
      bg: '#202020',
      textDecor: 'underline',
      borderColor: '#ffffff',
    },
  }
  const MenuButtonStyle = {
    bg: 'transparent',
    borderColor: 'white',
    fontSize: '20px',
    color: 'white',
    h: '60px',
    fontFamily: '["Times New Roman", "Times", "serif"]',
    _hover: { color: 'white', fontWeight: 'bold', textDecor: 'underline' },
  }
  const MenuListStyle = {
    bg: '#edf2f7',
    borderColor: 'rgb(0,0,0, 0.2)',
    boxShadow: ' 2px 2px #888888',
    fontSize: '20px',
    color: 'white',
    _hover: { bg: '#edf2f7', color: 'black' },
  }
  const MenuItemStlye = {
    bg: '#edf2f7',
    borderColor: 'black',
    borderRadius: '1px',
    color: 'black',
    fontSize: '20px',
    _hover: { bg: '#335075', color: 'white' },
  }

  function JobsMenu() {
    return (
      <>
        <Menu>
          <MenuButton {...MenuButtonStyle}>
            <Text>
              {' '}
              Jobs
              <ChevronDownIcon />{' '}
            </Text>
          </MenuButton>
          <MenuList {...MenuListStyle}>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">Empty link 1</Link>{' '}
            </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">jobsLink1</Link>
            </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">jobsLink2</Link>
            </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">jobsLink3</Link>
            </MenuItem>
          </MenuList>
        </Menu>
      </>
    )
  }
  function ImmigrationMenu() {
    return (
      <>
        <Menu isLazy>
          <MenuButton {...MenuButtonStyle}>
            <Text>
              Immigration <ChevronDownIcon />{' '}
            </Text>
          </MenuButton>
          <MenuList {...MenuListStyle}>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">immigrationlink 1 </Link>{' '}
            </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">immigrationlink 2 </Link>{' '}
            </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">immigrationlink 3 </Link>{' '}
            </MenuItem>
          </MenuList>
        </Menu>
      </>
    )
  }
  function TravelMenu() {
    return (
      <>
        <Menu isLazy>
          <MenuButton {...MenuButtonStyle}>
            <Text>
              {' '}
              Travel <ChevronDownIcon />{' '}
            </Text>
          </MenuButton>
          <MenuList {...MenuListStyle}>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">Link 1 </Link>{' '}
            </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">Link 2 </Link>{' '}
            </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">Link 3 </Link>{' '}
            </MenuItem>
          </MenuList>
        </Menu>
      </>
    )
  }
  function BusinessMenu() {
    return (
      <>
        <Menu isLazy>
          <MenuButton {...MenuButtonStyle}>
            <Text>
              {' '}
              Business <ChevronDownIcon />{' '}
            </Text>
          </MenuButton>
          <MenuList {...MenuListStyle}>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">Link 1 </Link>{' '}
            </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">Link 2 </Link>{' '}
            </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">Link 3 </Link>{' '}
            </MenuItem>
          </MenuList>
        </Menu>
      </>
    )
  }
  function BenefitsMenu() {
    return (
      <>
        <Menu isLazy>
          <MenuButton {...MenuButtonStyle}>
            <Text>
              {' '}
              Benefits <ChevronDownIcon />{' '}
            </Text>
          </MenuButton>
          <MenuList {...MenuListStyle}>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">Link 1 </Link>{' '}
            </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">Link 2 </Link>{' '}
            </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">Link 3 </Link>{' '}
            </MenuItem>
          </MenuList>
        </Menu>
      </>
    )
  }
  function HealthMenu() {
    return (
      <>
        <Menu isLazy>
          <MenuButton {...MenuButtonStyle}>
            <Text>
              {' '}
              Health <ChevronDownIcon />{' '}
            </Text>
          </MenuButton>
          <MenuList {...MenuListStyle}>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">Link 1 </Link>{' '}
            </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">Link 2 </Link>{' '}
            </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">Link 3 </Link>{' '}
            </MenuItem>
          </MenuList>
        </Menu>
      </>
    )
  }
  function TaxesMenu() {
    return (
      <>
        <Menu isLazy>
          <MenuButton {...MenuButtonStyle}>
            <Text>
              {' '}
              Taxes <ChevronDownIcon />{' '}
            </Text>
          </MenuButton>
          <MenuList {...MenuListStyle}>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">Link 1 </Link>{' '}
            </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">Link 2 </Link>{' '}
            </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">Link 3 </Link>{' '}
            </MenuItem>
          </MenuList>
        </Menu>
      </>
    )
  }
  function MoreServicesMenu() {
    return (
      <>
        <Menu isLazy>
          <MenuButton {...MenuButtonStyle}>
            <Text>
              {' '}
              More Services <ChevronDownIcon />{' '}
            </Text>
          </MenuButton>
          <MenuList {...MenuListStyle}>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">Link 1 </Link>{' '}
            </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">Link 2 </Link>{' '}
            </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link href="/">Link 3 </Link>{' '}
            </MenuItem>
          </MenuList>
        </Menu>
      </>
    )
  }

  return (
    <>
      <Box>
        <Flex
          w="100%"
          flex={1}
          justify={'space-between'}
          className="pagebody"
          id="pageMarginSetting"
          padding={'6px 8px'}
          align="center"
          as="header"
        >
          <Box></Box>
          {/* used to center the menu/hamburger, image, and translation */}

          <Image
            src={t('safeInputs.image')}
            w="auto"
            h="auto"
            maxW={{ base: '200px', sm: '250px', md: '300px', lg: '350px' }}
            returnNull={false}
          />
          <Box>
            {' '}
            {i18n.language === 'en' ? (
              <>
                <Link
                  href=""
                  defaultValue={i18n.language}
                  onClick={() => i18n.changeLanguage('fr')}
                >
                  {' '}
                  <Button {...LanguageButton}>
                    <Text>Fr</Text>
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href=""
                  defaultValue={i18n.language}
                  onClick={() => i18n.changeLanguage('en')}
                >
                  <Button {...LanguageButton}>
                    <Text>En</Text>
                  </Button>
                </Link>{' '}
              </>
            )}
          </Box>
        </Flex>
        <Flex
          h={16}
          alignItems={'center'}
          justifyContent={'space-around'}
          bg="#303030"
        >
          <HStack spacing={8} alignItems={'center'}>
            <JobsMenu />
            <ImmigrationMenu />
            <TravelMenu />
            <BusinessMenu />
            <BenefitsMenu />
            <HealthMenu />
            <TaxesMenu />
            <MoreServicesMenu />
          </HStack>
        </Flex>
      </Box>
    </>
  )
}
