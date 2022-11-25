import React from 'react'

import '../App.css'
import '../i18n'
import { Box, Link, Stack, Image, Text, SimpleGrid } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export default function FooterIdea1() {
  const LinkStyle = {
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
        minH="180px"
        color="#333333"
      >
        <SimpleGrid
          columns={[1, null,3]}
          justifyContent="space-around"
          id="pageMarginSetting"
          gap={[1, null, 3]}
          py={2}
          color="#FFFFFF"
        >
          <Box >
            <Stack>
              <Text fontSize={'2xl'} textDecor={'underline'}>
                About
              </Text>
              <Link href={''} {...LinkStyle}>
                <Text>Why GC Notify</Text>
              </Link>
              <Link href={''} {...LinkStyle}>
                <Text>Features</Text>
              </Link>
              <Link href={''} {...LinkStyle}>
                <Text>Activity on GC Notify</Text>
              </Link>
            </Stack>
          </Box>
          <Box  >
            <Stack justify={'end'}>
              <Text fontSize={'2xl'} textDecor={'underline'}>
                Using GC Notify
              </Text>
              <Link href={''} {...LinkStyle}>
                <Text>API documentation</Text>
              </Link>
              <Link href={''} {...LinkStyle}>
                <Text>Guidance</Text>
              </Link>
              <Link href={''} {...LinkStyle}>
                <Text>Service level objectives</Text>
              </Link>
            </Stack>
          </Box>
          <Box >
            <Stack>
              <Text fontSize={'2xl'} textDecor={'underline'}>
                Support
              </Text>
              <Link href={''} {...LinkStyle}>
                <Text>Contact Us</Text>
              </Link>
            </Stack>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Lower footer */}
      <SimpleGrid columns={[1, null, 7]} id="pageMarginSetting" gap={2} py={5}>
        <Box minW="80px">
          <Link href={''} {...LinkStyle}>
            <Text>Social Media</Text>
          </Link>
        </Box>
        <Box minW="80px">
          <Link href={''} {...LinkStyle}>
            <Text>Mobile Application</Text>
          </Link>
        </Box>
        <Box minW="80px">
        <Link href={`${t('footer.aboutCanadaCaLink')} `} {...LinkStyle} > <Text>{t('footer.aboutCanadaCa')}</Text></Link>

        </Box>
        <Box minW="80px">
          <Link href={''} {...LinkStyle}>
            <Text>Terms and Conditions</Text>
          </Link>
        </Box>
        <Box minW="80px">
          <Link href={''} {...LinkStyle}>
            <Text>Privacy</Text>
          </Link>
        </Box>
        <Box minW="80px"></Box>
        <Box minW="80px" h="50px">
          <Image
            src="https://www.canada.ca/etc/designs/canada/wet-boew/assets/wmms-blk.svg"
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
    </>
  )
}
