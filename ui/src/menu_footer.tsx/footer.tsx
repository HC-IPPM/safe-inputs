import React from 'react';

import '../App.css'
import '../i18n'
import { Box, Link, Stack, Image, Center, Wrap, WrapItem, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';


export default function Footer() {
    const UpperLinkStyle = { color: 'white', _hover: { color: '#0089c7', textDecoration: 'underline' } }
    const LowerLinkStyle = { color: '#0089c7', _hover: { color: 'purple', textDecoration: 'underline' } }
    const { t } = useTranslation()

    return (
        <>
            <Box bg="#444444" mt={12} >
                <Wrap id='pageMarginSetting' justify='space-between' align='center' p='2px 2px' pt={2} pb={2}>
                    <WrapItem >
                        <Stack >
                            <Link href={`${t('footer.contactUsLink')}`} {...UpperLinkStyle}><Text>{t('footer.contactUs')}</Text></Link>
                            <Link href={`${t('footer.departmentsAgenciesLink')}`} {...UpperLinkStyle}><Text>{t('footer.departmentsAgencies')}</Text></Link>
                            <Link href={`${t('footer.publicServiceMilitaryLink')} `} {...UpperLinkStyle}><Text>{t('footer.publicServiceMilitary')}</Text></Link>
                        </Stack>
                    </WrapItem>
                    <WrapItem >
                        <Stack >
                            <Link href={`${t('footer.newsLink')} `} {...UpperLinkStyle}><Text>{t('footer.news')}</Text></Link>
                            <Link href={`${t('footer.treatiesLawsRegulationsLink')} `} {...UpperLinkStyle}><Text>{t('footer.treatiesLawsRegulations')}</Text></Link>
                            <Link href={`${t('footer.governmentReportingLink')} `} {...UpperLinkStyle}><Text>{t('footer.governmentReporting')}</Text></Link>
                        </Stack>
                    </WrapItem>
                    <WrapItem >
                        <Stack >
                            <Link href={`${t('footer.primeMinisterLink')} `} {...UpperLinkStyle}><Text>{t('footer.primeMinister')}</Text></Link>
                            <Link href={`${t('footer.aboutGovernmentLink')} `} {...UpperLinkStyle}><Text>{t('footer.aboutGovernment')}</Text></Link>
                            <Link href={`${t('footer.openGovernmentLink')} `} {...UpperLinkStyle}><Text>{t('footer.openGovernment')}</Text></Link>
                        </Stack>
                    </WrapItem>
                </Wrap>
            </Box>
            <Box bg='white' pt={2} pb={2}>
                <Wrap id='pageMarginSetting' justify='space-evenly' align='center' pb={3}>
                    <WrapItem>
                        <Center >
                            <Link href={`${t('footer.socialMediaLink')} `} {...LowerLinkStyle}> <Text>{t('footer.socialMedia')}</Text></Link>
                        </Center>
                    </WrapItem>
                    <WrapItem>
                        <Center >
                            <Link href={`${t('footer.mobileApplicationLink')} `} {...LowerLinkStyle} > <Text>{t('footer.mobileApplication')}</Text></Link>
                        </Center>
                    </WrapItem>
                    <WrapItem>
                        <Center >
                            <Link href={`${t('footer.aboutCanadaCaLink')} `} {...LowerLinkStyle} > <Text>{t('footer.aboutCanadaCa')}</Text></Link>
                        </Center>
                    </WrapItem>
                    <WrapItem>
                        <Center>
                            <Link href={`${t('footer.termsConditionsLink')} `} {...LowerLinkStyle} > <Text>{t('footer.termsConditions')}</Text></Link>
                        </Center>
                    </WrapItem>
                    <WrapItem>
                        <Center >
                            <Link href={`${t('footer.privacyLink')} `} {...LowerLinkStyle} > <Text>{t('footer.privacy')}</Text></Link>
                        </Center>
                    </WrapItem>
                </Wrap>
            </Box>
            <Center pb={3} >
                <Image src='https://www.canada.ca/etc/designs/canada/wet-boew/assets/wmms-blk.svg'
                    w='auto' h='auto' maxW={{ base: '100px', sm: '100px', md: '125px', lg: '150px' }} />
            </Center>

            {/* <Button position='fixed' padding='1px 2px' fontSize='20px' bottom='10px' left='90px'
                backgroundColor='#284162' color='#fff' textAlign='center'
                onClick={() => { window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); }} >
                <ChevronUpIcon />  </Button> */}
        </>
    )
}