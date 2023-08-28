import React from 'react'
import { Trans } from "@lingui/macro";
import { HStack, Box, Container, Link } from '@chakra-ui/react'

import LanguageButton from "../LanguageButton"

import CanadaLogo from "../../assets/sig-blk-fr.svg";


export default function Header() {

    return (
        <>
            <Box bg="#EEEEEE">
                <Container maxW="7xl" px={{ base: 5, md: 10 }} py={4}>
                    <HStack justify="space-between">
                        <HStack>
                            <CanadaLogo />
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