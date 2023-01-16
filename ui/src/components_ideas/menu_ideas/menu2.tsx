import React from 'react'

import '../../App.css'
import '../../i18n'
import {
  HStack,
  Box,
  Image,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FcMenu } from 'react-icons/fc'

export default function MenuIdea2() {
  const { t, i18n } = useTranslation()

  return (
    <>
      <Box>
        <HStack justify={'space-between'} h="60px" className="pagebody">
          <Box></Box>{' '}
          {/* used to center the menu/hamburger, image, and translation */}
          <Box>
            <Menu>
              <MenuButton
                className="menu"
                as={Button}
                aria-label="Options"
                bg="transparent"
                color="gray"
                _hover={{ bg: 'transparent' }}
                _expanded={{ bg: 'grey.400' }}
              >
                <FcMenu />
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <Link href="/">{t('menu.home')}</Link>
                </MenuItem>
                <MenuItem>
                  <Link href="/secondpage"> {t('menu.secondPage')}</Link>
                </MenuItem>
                <MenuItem>
                  <Link href="/thirdpage"> {t('menu.thirdPage')}</Link>
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
          <Image
            src={t('safeInputs.image')}
            w="auto"
            h="auto"
            maxW={{ base: '200px', sm: '250px', md: '300px', lg: '350px' }}
            returnNull={false}
          />
          <Box>
            {i18n.language === 'en' ? (
              <>
                <Link
                  href=""
                  defaultValue={i18n.language}
                  onClick={() => i18n.changeLanguage('fr')}
                >
                  {' '}
                  <Text className="translationButton">Français</Text>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href=""
                  defaultValue={i18n.language}
                  onClick={() => i18n.changeLanguage('en')}
                >
                  <Text>English</Text>
                </Link>{' '}
              </>
            )}
          </Box>
          <Box></Box>
          {/* used to center the menu/hamburger, image, and translation */}
        </HStack>
      </Box>
    </>
  )
}
