import React from 'react'

import '../App.css'
import '../i18n'
import { Box, Link, Image, Text, SimpleGrid, Container } from '@chakra-ui/react'
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
        as="footer"
        role="contentinfo"
        color="#333333"
        position="fixed"
        bottom="1px"
        w={'100vw'}
      >
        <Container maxW="7xl" px={10} color="#FFFFFF">
          <SimpleGrid
            columns={[1, null, 4]}
            gap={[2, null, 10]}
            py={2}
            color="#FFFFFF"
            h="130px"
          >
            <Box pt={{ base: 0, md: 20 }}>
              <Link href="/termsConditions" {...LinkStyle}>
                <Text>{t('footer.termsConditions')}</Text>
              </Link>
            </Box>
            <Box pt={{ base: 0, md: 20 }}>
              <Link href={`${t('footer.privacyLink')} `} {...LinkStyle}>
                <Text>{t('footer.privacy')}</Text>
              </Link>
            </Box>
            <Box></Box>
            <Box pt={{ base: 0, md: 20 }}>
              <Image
                // src="https://www.canada.ca/etc/designs/canada/wet-boew/assets/wmms-blk.svg" //black font Canada Wordmark
                src="https://cpra.ca/wp-content/uploads/2021/05/logo_canada.svg" //white font Canada Wordmark
                w="auto"
                h="auto"
                maxW={{
                  base: '100px',
                  sm: '100px',
                  md: '125px',
                  lg: '150px',
                }}
              />
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* This box adds a sm,all white box under the sticky footer to give a small seperation between the footer and the true bottom of the page  */}
      <Box h="1px" bg="white" position="fixed" bottom="0px" w={'100vw'}></Box>
    </>
  )
}
