import React from 'react';

import '../i18n'
import '../App.css'
import { ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Link, Stack, Image, Button, Center, Wrap, WrapItem, Text} from '@chakra-ui/react';



export default function Footer() {
    const UpperLinkStyle = { color: 'white', _hover: { color: '#0089c7', textDecoration: 'underline' } }
    const LowerLinkStyle = { color: '#0089c7', _hover: { color: 'purple', textDecoration: 'underline' } }

    return (
        <>
            <Box bg='grey'>
                <Wrap id='pageMarginSetting' justify='space-between' align='center' p='2px 2px'>
                    <WrapItem >
                        <Stack >
                            <Link href={'#'} {...UpperLinkStyle}><Text>Contact Us</Text></Link>
                            <Link href={'#'} {...UpperLinkStyle}><Text>Departments and Agencies</Text></Link>
                            <Link href={'#'} {...UpperLinkStyle}><Text>Public Service and Military</Text></Link>
                        </Stack>
                    </WrapItem>
                    <WrapItem >
                        <Stack >
                            <Link href={'#'} {...UpperLinkStyle}><Text>News</Text></Link>
                            <Link href={'#'} {...UpperLinkStyle}><Text>Treaties, Laws and Regulations</Text></Link>
                            <Link href={'#'} {...UpperLinkStyle}><Text>Government-wide Reporting</Text></Link>
                        </Stack>
                    </WrapItem>
                    <WrapItem >
                        <Stack >
                            <Link href={'#'} {...UpperLinkStyle}><Text>Prime Minister</Text></Link>
                            <Link href={'#'} {...UpperLinkStyle}><Text>About Canada.ca</Text></Link>
                            <Link href={'#'} {...UpperLinkStyle}><Text>Open Government</Text></Link>
                        </Stack>
                    </WrapItem>
                </Wrap>
            </Box>
            <Box bg='white'>
                <Wrap id='pageMarginSetting' justify='space-evenly' align='center'  pb={3}>
                    <WrapItem>
                        <Center >
                            <Link href={'#'} {...LowerLinkStyle}> <Text>Social Media</Text></Link>
                        </Center>
                    </WrapItem>
                    <WrapItem>
                        <Center >
                            <Link href={'#'} {...LowerLinkStyle} > <Text>Mobile applications</Text></Link>
                        </Center>
                    </WrapItem>
                    <WrapItem>
                        <Center >
                            <Link href={'#'} {...LowerLinkStyle} > <Text>About Canada.ca</Text></Link>
                        </Center>
                    </WrapItem>
                    <WrapItem>
                        <Center>
                            <Link href={'#'} {...LowerLinkStyle} > <Text>Terms and Conditions</Text></Link>
                        </Center>
                    </WrapItem>
                    <WrapItem>
                        <Center >
                            <Link href={'#'} {...LowerLinkStyle} > <Text>Privacy</Text></Link>
                        </Center>
                    </WrapItem>
                </Wrap>
            </Box>
            <Center>
                <Image src='https://www.canada.ca/etc/designs/canada/wet-boew/assets/wmms-blk.svg' w='200px' /></Center>
                <br></br>
            <Button position='fixed' padding='1px 2px' fontSize='20px' bottom='10px' left='90px'
                backgroundColor='#284162' color='#fff' textAlign='center'
                onClick={() => { window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); }} >
                <ChevronUpIcon />  </Button>
        </>
    )
}