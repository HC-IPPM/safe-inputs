import React from 'react'
import { Trans } from "@lingui/macro";
import { HStack, Box, Container, Link } from '@chakra-ui/react'

import LanguageButton from "../LanguageButton"

import CanadaLogo from "../../assets/sig-blk-en.svg";
// import { WordMark } from './wordmarks'


export default function Header() {

    return (
        <>
            <Box bg="#EEEEEE">
                <Container maxW="7xl" px={{ base: 5, md: 10 }} py={4}>
                    <HStack justify="space-between">
                        <Link
                            bg="transparent"
                            h="auto"
                            _hover={{
                                bg: 'transparent',
                            }}
                            maxW={{ base: '250px', sm: '300px', md: '365px', lg: '400px' }}
                            minW={{ base: '180px', sm: '265px', md: '400px', lg: '365px' }}
                            href="/"
                        >
                            <CanadaLogo />
                        </Link>
                        <HStack>
                            <Link href="/">
                                <Trans>
                                    Home
                                </Trans>
                            </Link>
                            <LanguageButton />
                        </HStack>
                    </HStack>
                </Container>
            </Box>
        </>
    )
}