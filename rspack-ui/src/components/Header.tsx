import React from 'react'
import { Trans } from "@lingui/macro";
import { HStack, Box, Container, Link } from '@chakra-ui/react'


import LanguageButton from "./LanguageButton"

export default function TopHeader() {

    return (
        <>
            <Box bg="#EEEEEE">
                <Container maxW="7xl" px={{ base: 5, md: 10 }} py={4}>
                    <HStack justify="space-between">
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