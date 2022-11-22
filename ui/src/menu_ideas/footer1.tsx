import React from 'react'

import '../App.css'
import '../i18n'
import {
  Box,
  Link,
  Stack,
  Image,
  Center,
  Wrap,
  WrapItem,
  Text,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export default function FooterIdea1() {
  const UpperLinkStyle = {
    _hover: { color: '#0089c7', textDecoration: 'underline' },
  }
  const LowerLinkStyle = {
    _hover: { color: 'purple', textDecoration: 'underline' },
  }
  const { t } = useTranslation()

  return (
    <>
      <Box
        mt={12}
        p={3}
        borderTop="1px solid #ffffff"
        bg="#26374a"
        style={{
          backgroundImage:
            'url(https://health-infobase.canada.ca/src/GCWeb/assets/landscape.png)  ',
          backgroundPosition: 'right bottom',
          backgroundRepeat: 'no-repeat',
        }}
        h="180px"
        color="#333333"
      >
        <Wrap
          id="pageMarginSetting"
          justify="space-between"
          color={'#FFFFFF'}
          align={'flex-start'}
        >
          <WrapItem>
            <Center w="180px">
              <Stack>
                <Text fontSize={'2xl'} color="#ffffff" textDecor={'underline'}>
                  About
                </Text>
                <Link href={''} {...UpperLinkStyle}>
                  <Text>Why GC Notify</Text>
                </Link>
                <Link href={''} {...UpperLinkStyle}>
                  <Text>Features</Text>
                </Link>
                <Link href={''} {...UpperLinkStyle}>
                  <Text>Activity on GC Notify</Text>
                </Link>
              </Stack>
            </Center>
          </WrapItem>
          <WrapItem>
            <Center w="180px">
              <Stack>
                <Text fontSize={'2xl'} color="#ffffff" textDecor={'underline'}>
                  Using GC Notify
                </Text>
                <Link href={''} {...UpperLinkStyle}>
                  <Text>API documentation</Text>
                </Link>
                <Link href={''} {...UpperLinkStyle}>
                  <Text>Guidance</Text>
                </Link>
                <Link href={''} {...UpperLinkStyle}>
                  <Text>Service level objectives</Text>
                </Link>
              </Stack>
            </Center>
          </WrapItem>
          <WrapItem>
            <Center w="180px">
              <Stack justify={'top'}>
                <Text fontSize={'2xl'} color="#ffffff" textDecor={'underline'}>
                  Support
                </Text>
                <Link href={''} {...UpperLinkStyle}>
                  <Text>Contact Us</Text>
                </Link>
              </Stack>
            </Center>
          </WrapItem>
        </Wrap>
      </Box>

      <Box bg="#26374a" borderTop="1px solid #ffffff" color='#FFFFFF'>
        <Wrap
          id="pageMarginSetting"
          justify="space-between"
          align="center"
          pb={3}
          mb={3}
        >
          <WrapItem>
            <Center h="60px">
              <Link
                href={`${t('footer.socialMediaLink')} `}
                {...LowerLinkStyle}
              >
                {' '}
                <Text>{t('footer.socialMedia')}</Text>
              </Link>
            </Center>
          </WrapItem>
          <WrapItem>
            <Center>
              <Link
                href={`${t('footer.mobileApplicationLink')} `}
                {...LowerLinkStyle}
              >
                {' '}
                <Text>{t('footer.mobileApplication')}</Text>
              </Link>
            </Center>
          </WrapItem>
          <WrapItem>
            <Center>
              <Link
                href={`${t('footer.aboutCanadaCaLink')} `}
                {...LowerLinkStyle}
              >
                {' '}
                <Text>{t('footer.aboutCanadaCa')}</Text>
              </Link>
            </Center>
          </WrapItem>
          <WrapItem>
            <Center>
              <Link
                href={`${t('footer.termsConditionsLink')} `}
                {...LowerLinkStyle}
              >
                {' '}
                <Text>{t('footer.termsConditions')}</Text>
              </Link>
            </Center>
          </WrapItem>
          <WrapItem>
            <Center>
              <Link href={`${t('footer.privacyLink')} `} {...LowerLinkStyle}>
                {' '}
                <Text>{t('footer.privacy')}</Text>
              </Link>
            </Center>
          </WrapItem>
        </Wrap>
      </Box>
      <Center pb={3}>
        <Image
          src="https://www.canada.ca/etc/designs/canada/wet-boew/assets/wmms-blk.svg"
          w="auto"
          h="auto"
          maxW={{ base: '100px', sm: '100px', md: '125px', lg: '150px' }}
        />
      </Center>

      {/* <Button position='fixed' padding='1px 2px' fontSize='20px' bottom='10px' left='90px'
                backgroundColor='#284162' color='#fff' textAlign='center'
                onClick={() => { window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); }} >
                <ChevronUpIcon />  </Button> */}
    </>
  )
}
