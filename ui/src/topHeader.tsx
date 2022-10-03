import React, {ChangeEvent} from 'react';

import './i18n'

import { HStack,Box, Flex, Image, Link } from "@chakra-ui/react";
import {useTranslation} from "react-i18next";

import {availableLanguages} from "./i18n";


export default function TopHeader1() {

    const {t, i18n} = useTranslation()

    return (
        <>
<Box>
          <HStack justify={'space-around'} h='60px'>
            <Box></Box>
            <Image src={t('safe_inputs.image')} w='400px' />
            <Box justifyContent={'baseline'} h='50px'>

              {i18n.language === 'en' ? (<><Link color='blue' defaultValue={i18n.language} onClick={() => i18n.changeLanguage('fr')}
              > Français</Link></>) : (<><Link color='blue' defaultValue={i18n.language} onClick={() => i18n.changeLanguage('en')}
              >English</Link> </>)}
            </Box>

          </HStack>
        </Box>
        </>
    )
}