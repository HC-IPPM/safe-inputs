import React from 'react';

import { Box, Container, Link, SimpleGrid, Stack, Image, Button, Text, } from '@chakra-ui/react';




export default function Footer() {

    const UpperLinkStyle = { _hover: { color: '#0089c7', textDecoration: 'underline' } }
    const LowerLinkStyle = { color: '#0089c7', _hover: { color: 'purple', textDecoration: 'underline' } }

    function FooterLargeDisp() {
        return (
            <>
                <Box>
                    <Container as={Stack} maxW={'6xl'} py={8} display={{ base: 'none', md: 'flex' }}>
                        <SimpleGrid columns={{ base: 1, sm: 1, md: 3 }} spacing={8} flex='1' justifyItems="space-around">
                            <Stack align={'flex-start'} >
                                <Link href={'#'} {...UpperLinkStyle}>Contact us</Link>
                                <Link href={'#'} {...UpperLinkStyle}>Departments and agencies</Link>
                                <Link href={'#'} {...UpperLinkStyle}>Public service and military</Link>
                            </Stack>
                            <Stack align={'flex-start'}>
                                <Link href={'#'} {...UpperLinkStyle}>News</Link>
                                <Link href={'#'} {...UpperLinkStyle}>Treaties, laws, regulations</Link>
                                <Link href={'#'} {...UpperLinkStyle}>Government-wide reporting</Link>
                            </Stack>
                            <Stack align={'flex-start'}>
                                <Link href={'#'} {...UpperLinkStyle}>Prime Minister</Link>
                                <Link href={'#'} {...UpperLinkStyle}>About government</Link>
                                <Link href={'#'} {...UpperLinkStyle}>Open government</Link>
                            </Stack>
                        </SimpleGrid>
                    </Container>
                </Box>
                <Box bg='white'>
                    <Container as={Stack} maxW={'6xl'} py={1} display={{ base: 'none', md: 'flex' }} >
                        <SimpleGrid columns={{ base: 1, sm: 3, md: 6, lg: 6 }} spacing={2}   >
                            <Stack align={'center'} justify={'center'} direction='row'><Link href={'#'} {...LowerLinkStyle}> Social Media </Link> </Stack>
                            <Stack align={'center'} justify={'center'} ><Link href={'#'} {...LowerLinkStyle} > Mobile applications</Link></Stack>
                            <Stack align={'center'} justify={'center'} direction='row'  ><Link href={'#'} {...LowerLinkStyle} > About Canada.ca</Link></Stack>
                            <Stack align={'center'} justify={'center'} direction='row'  ><Link href={'#'} {...LowerLinkStyle} > Terms and Conditions</Link></Stack>
                            <Stack align={'center'} justify={'center'} direction='row'  >
                                <Link href={'#'} {...LowerLinkStyle} > Privacy</Link> </Stack>
                            <Image src='https://www.canada.ca/etc/designs/canada/wet-boew/assets/wmms-blk.svg' />
                        </SimpleGrid>
                    </Container>
                </Box>
            </>
        )
    }

    function FooterSmallDisp() {
        return (
            <>
                <Box>
                    <Container as={Stack} maxW={'6xl'} py={8} display={{ sm: 'flex', md: 'none' }}>
                        <SimpleGrid columns={{ base: 1, sm: 1, md: 1 }} spacing={8} flex='1' justifyItems="space-around" fontSize={14}>
                            <Stack align={'flex-start'} >
                                <Link href={'#'} {...UpperLinkStyle}>Contact us </Link>
                                <Link href={'#'} {...UpperLinkStyle}>Departments and agencies</Link>
                                <Link href={'#'} {...UpperLinkStyle}>Public service and military</Link>
                                <Link href={'#'} {...UpperLinkStyle}>News</Link>
                                <Link href={'#'} {...UpperLinkStyle}>Treaties, laws, regulations</Link>
                                <Link href={'#'} {...UpperLinkStyle}>Government-wide reporting</Link>
                                <Link href={'#'} {...UpperLinkStyle}>Prime Minister</Link>
                                <Link href={'#'} {...UpperLinkStyle}>About government</Link>
                                <Link href={'#'} {...UpperLinkStyle}>Open government</Link>
                            </Stack>
                        </SimpleGrid>
                    </Container>
                </Box>
                <Box bg='white'>
                    <Container as={Stack} maxW={'6xl'} py={1} display={{ sm: 'flex', md: 'none' }}>
                        <SimpleGrid columns={{ base: 1, sm: 1, md: 1 }} spacing={2} bg='white' fontSize={14} >
                            <Stack >
                                <Link href={'#'} {...LowerLinkStyle}> Social Media</Link>
                                <Link href={'#'} {...LowerLinkStyle} > Mobile applications</Link>
                                <Link href={'#'} {...LowerLinkStyle} > About Canada.ca</Link>
                                <Link href={'#'} {...LowerLinkStyle} > Terms and Conditions</Link>
                                <Link href={'#'} {...LowerLinkStyle} > Privacy</Link>
                                <Box>
                                <Button position='fixed' padding='1px 2px' fontSize='20px' bottom='10px' left='90px'
                backgroundColor='#284162' color='#fff' textAlign='center'
                onClick={() => { window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); }} >
                <Text className='pagebody' color='white'>Top </Text> </Button>
                                    <Image src='https://www.canada.ca/etc/designs/canada/wet-boew/assets/wmms-blk.svg' w='50%' />
                                </Box>
                            </Stack>
                        </SimpleGrid>
                        <br></br>
                    </Container>
                </Box>            
            </>
        )
    }

    return (

        <>


            <div />

            {/* 👇️ scroll to top on button click */}
          

            <Box bg="#444444" color="white"  >
                <FooterLargeDisp />
                <FooterSmallDisp />
            </Box>
        </>
    )
}