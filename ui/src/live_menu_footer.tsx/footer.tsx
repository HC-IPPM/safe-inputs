import React from 'react'

import '../App.css'
import '../i18n'
import {
  Box,
  Link,
  Image,
  Text,
  SimpleGrid,
  Container,
  Spacer,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const LinkStyle = {
    fontSize: { base: '10px', sm: '12px', md: '13px', lg: '16px' },
    fontFamily: 'sans-serif',
    _hover: { color: '#0089c7', textDecoration: 'underline' },
  }

  const { t } = useTranslation()

  return (
    <>
      <Box
        mt={2}
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
            >
              <SimpleGrid columns={[1, null, 2]} gap={{ base: 3, md: 0 }}>
                <Box pt={{ base: 6, md: 20 }}>
                  <Link href="/termsConditions" {...LinkStyle}>
                    <Text>{t('footer.termsConditions')}</Text>
                  </Link>
                </Box>
                <Box pt={{ base: 0, md: 20 }}>
                  <Link href={`${t('footer.privacyLink')} `} {...LinkStyle}>
                    <Text>{t('footer.privacy')}</Text>
                  </Link>
                </Box>
              </SimpleGrid>
            </Box>
            <Spacer />
            <Spacer />
            <Spacer />
            <Spacer />
            <Box pt={{ base: 5, md: 20 }}>
              <Image
                loading="lazy"
                src={
                  process.env.PUBLIC_URL + 'images/logo_canada_whiteFont.svg'
                }
                w="auto"
                h="auto"
                maxW={{
                  base: '100px',
                  sm: '100px',
                  md: '125px',
                  lg: '150px',
                }}
                alt={t('footer.canadaImageAlt')}
              />
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* This box adds a sm,all white box under the sticky footer to give a small seperation between the footer and the true bottom of the page  */}
      <Box h="5px" bg="white" position="relative" bottom="0px" w={'100%'}></Box>
    </>
  )
}
