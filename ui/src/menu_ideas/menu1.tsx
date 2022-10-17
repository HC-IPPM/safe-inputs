import React from 'react';

import '../App.css'
import '../i18n'
import { HStack, Box, Image, Link, Button, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";


export default function TopHeader2() {

    const { t, i18n } = useTranslation()
    const LanuageButton = { h: '30px', w: '30px', bg: 'transparent', outline: 'varient', color: 'black', border: '1px', _hover: { color: '#ffffff', bg: '#202020', textDecor: 'underline', borderColor: '#ffffff' } }

    return (
        <>
            <Box bg='#EEEEEE'>
                <Flex w='100%' flex={1} justify={'space-between'} className="pagebody" id='pageMarginSetting' padding={'6px 8px'}
                    as="header" >
                    <Image src={t('safeInputs.image')} w={'300px'} />
                    <Box id='pageMarginSetting' bg='transparent' fontFamily="Noto Sans" >
                        <HStack gap={3} fontFamily={"Noto Sans"} fontSize='19px' color='#0B0C0C'>
                            <Box >
                                <Link href='/' >{t("menu.home")}</Link>
                            </Box><Box >
                                <Link href='/secondpage'> {t("menu.secondPage")}</Link>
                            </Box><Box>
                                <Link href='/thirdpage'> {t("menu.thirdPage")}</Link>
                            </Box>
                            <Box fontSize={{ base: '12px', md: '14px' }}  >
                                {i18n.language === 'en' ? (<><Link href='' defaultValue={i18n.language} onClick={() => i18n.changeLanguage('fr')}
                                > <Button {...LanuageButton}>Fr</Button></Link></>) : (<><Link href='' defaultValue={i18n.language} onClick={() => i18n.changeLanguage('en')}
                                ><Button {...LanuageButton}>En</Button></Link> </>)}
                            </Box>
                        </HStack>
                    </Box>
                </Flex>
            </Box>
        </>
    )
}