import React from "react";

import '../App.css'
import '../i18n'
import { HStack, Box, Image, Link, Button, Menu, MenuButton, MenuList, MenuItem, } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FcMenu } from "react-icons/fc";

export default function MenuIdea2() {

    const { t, i18n } = useTranslation()

    return (
        <>
            <Box  >
                <HStack justify={'space-around'} h='60px' className="pagebody" >
                <Box></Box>
                    <Box>
                        <Menu>
                            <MenuButton as={Button} aria-label='Options' bg='transparent' color='gray' _hover={{ bg: 'transparent' }} _expanded={{ bg: 'grey.400' }}>
                                <FcMenu />
                            </MenuButton>
                            <MenuList>
                                <MenuItem >
                                    <Link href='/' >{t("menu.home")}</Link>
                                </MenuItem>
                                <MenuItem >
                                    <Link href='/secondpage'> {t("menu.secondPage")}</Link>
                                </MenuItem>
                                <MenuItem >
                                    <Link href='/thirdpage'> {t("menu.thirdPage")}</Link>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Box>
                    <Image src={t('safeInputs.image')} w={{ base: '300px', md: '400px' }} />
                    <Box fontSize={{ base: '12px', md: '14px' }}  >
                        {i18n.language === 'en' ? (<><Link href='' defaultValue={i18n.language} onClick={() => i18n.changeLanguage('fr')}
                        > Français</Link></>) : (<><Link href='' defaultValue={i18n.language} onClick={() => i18n.changeLanguage('en')}
                        >English</Link> </>)}
                    </Box>
                    <Box></Box>
                </HStack>
            </Box>
        </>
    )
}