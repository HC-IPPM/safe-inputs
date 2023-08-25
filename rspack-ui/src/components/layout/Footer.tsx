import React from 'react'

import {
    Box,
    Link,
    Text,
    SimpleGrid,
    Container,
    Spacer,
} from '@chakra-ui/react'

import { Link as ReactRouterLink } from 'react-router-dom'

import { Trans } from '@lingui/macro';

const BoxStyle = {
    mt: 10,
    py: 3,
    borderTop: "1px solid #ffffff",
    bg: "#26374a",
    style: {
        backgroundImage: 'url(images/landscape.png)',
        backgroundPosition: 'right bottom',
        backgroundRepeat: 'no-repeat',
    },
    as: "footer",
    role: "contentinfo",
    color: "#333333",
    position: "relative",
    bottom: "0px",
    w: '100%'
}

export default function Footer() {
    const LinkStyle = {
        fontSize: { base: '10px', sm: '12px', md: '13px', lg: '16px' },
        fontFamily: 'sans-serif',
        _hover: { color: '#0089c7', textDecoration: 'underline' },
    }


    return (
        <>
            <Box
                mt={10}
                py={3}
                borderTop="1px solid #ffffff"
                bg="#26374a"
                style={{
                    backgroundImage: 'url(images/landscape.png)',
                    backgroundPosition: 'right bottom',
                    backgroundRepeat: 'no-repeat',
                }}
                as="footer"
                role="contentinfo"
                color="#333333"
                position="relative"
                bottom="0px"
                w={'100%'}
            >
                <Container maxW="7xl" color="#FFFFFF" pl={{ base: 5, md: 10 }}>
                    <SimpleGrid columns={[1, null, 6]}>
                        <Box
                            minW={{
                                base: '200px',
                                sm: '200px',
                                md: '350px',
                            }}
                            zIndex="1"
                        >
                            <SimpleGrid columns={[1, null, 2]} gap={{ base: 3, md: 0 }}>
                                <Box pt={{ base: 6, md: 20 }}>
                                    <Trans>
                                        <Link as={ReactRouterLink} to="/termsAndConditions" {...LinkStyle}>
                                            <Text>Terms and Conditions</Text>
                                        </Link>
                                    </Trans>
                                </Box>
                                <Box pt={{ base: 0, md: 20 }}>
                                    <Trans>
                                        <Link href="https://www.canada.ca/en/transparency/privacy.html" {...LinkStyle}>
                                            <Text>
                                                Privacy
                                            </Text>
                                        </Link>
                                    </Trans>
                                </Box>
                            </SimpleGrid>
                        </Box>
                        <Spacer />
                        <Spacer />
                        <Spacer />
                        <Spacer />
                        {/* Sets the position of the CanadaWithFlag */}
                        <Box pt={{ base: 5, md: 20 }}>
                            {/* Contropls the size of the CanadaWithFlag */}
                            <Box
                                w="auto"
                                h="auto"
                                maxW={{
                                    base: '100px',
                                    sm: '100px',
                                    md: '125px',
                                    lg: '150px',
                                }}
                            >
                            </Box>
                        </Box>
                    </SimpleGrid >
                </Container >
            </Box >

            {/* This box adds a sm,all white box under the sticky footer to give a small seperation between the footer and the true bottom of the page  */}
            < Box h="5px" bg="white" position="relative" bottom="0px" w={'100%'} ></Box >
        </>
    )
}