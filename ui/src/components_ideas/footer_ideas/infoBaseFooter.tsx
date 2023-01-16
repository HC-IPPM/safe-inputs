import React from 'react'

import '../../App.css'
import '../../i18n'
import {
  Box,
  Link,
  Stack,
  Image,
  Text,
  SimpleGrid,
  Container,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export default function FooterIdea1() {
  const LinkStyle = {
    _hover: { color: '#0089c7', textDecoration: 'underline' },
  }

  const { t } = useTranslation()
  const UpperLinkStyle = {
    color: '#ffffff',
    _hover: { color: '#0089c7', textDecoration: 'underline' },
  }
  const LowerLinkStyle = {
    color: '#00587f',
    _hover: { color: 'purple', textDecoration: 'underline' },
  }
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
        color="#333333"
      >
        <Container maxW="7xl" px={10}>
          <SimpleGrid
            columns={[1, null, 3]}
            gap={[2, null, 10]}
            py={2}
            color="#FFFFFF"
          >
            <Box>
              <Stack>
                <Link href={`${t('footer.contactUsLink')}`} {...UpperLinkStyle}>
                  <Text>{t('footer.contactUs')}</Text>
                </Link>
                <Link
                  href={`${t('footer.departmentsAgenciesLink')}`}
                  {...UpperLinkStyle}
                >
                  <Text>{t('footer.departmentsAgencies')}</Text>
                </Link>
                <Link
                  href={`${t('footer.publicServiceMilitaryLink')} `}
                  {...UpperLinkStyle}
                >
                  <Text>{t('footer.publicServiceMilitary')}</Text>
                </Link>
              </Stack>
            </Box>
            <Box>
              <Stack>
                <Link href={`${t('footer.newsLink')} `} {...UpperLinkStyle}>
                  <Text>{t('footer.news')}</Text>
                </Link>
                <Link
                  href={`${t('footer.treatiesLawsRegulationsLink')} `}
                  {...UpperLinkStyle}
                >
                  <Text>{t('footer.treatiesLawsRegulations')}</Text>
                </Link>
                <Link
                  href={`${t('footer.governmentReportingLink')} `}
                  {...UpperLinkStyle}
                >
                  <Text>{t('footer.governmentReporting')}</Text>
                </Link>
              </Stack>
            </Box>
            <Box>
              <Stack>
                <Link
                  href={`${t('footer.primeMinisterLink')} `}
                  {...UpperLinkStyle}
                >
                  <Text>{t('footer.primeMinister')}</Text>
                </Link>
                <Link
                  href={`${t('footer.aboutGovernmentLink')} `}
                  {...UpperLinkStyle}
                >
                  <Text>{t('footer.aboutGovernment')}</Text>
                </Link>
                <Link
                  href={`${t('footer.openGovernmentLink')} `}
                  {...UpperLinkStyle}
                >
                  <Text>{t('footer.openGovernment')}</Text>
                </Link>
              </Stack>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Lower footer */}
      <Container maxW="7xl" px={10}>
        <SimpleGrid columns={[1, null, 7]} gap={1} py={5}>
          <Box minW="80px">
            <Link href={`${t('footer.socialMediaLink')} `} {...LowerLinkStyle}>
              <Text>{t('footer.socialMedia')}</Text>
            </Link>
          </Box>
          <Box>
            <Link
              href={`${t('footer.mobileApplicationLink')} `}
              {...LowerLinkStyle}
            >
              <Text>{t('footer.mobileApplication')}</Text>
            </Link>
          </Box>
          <Box minW="80px">
            <Link href={`${t('footer.aboutCanadaCaLink')} `} {...LinkStyle}>
              <Text>{t('footer.aboutCanadaCa')}</Text>
            </Link>
          </Box>
          <Box minW="80px">
            <Link
              href={`${t('footer.termsConditionsLink')} `}
              {...LowerLinkStyle}
            >
              {' '}
              <Text>{t('footer.termsConditions')}</Text>
            </Link>
          </Box>
          <Box minW="80px">
            <Link href={`${t('footer.privacyLink')} `} {...LowerLinkStyle}>
              {' '}
              <Text>{t('footer.privacy')}</Text>
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
              returnNull={false}
            />
          </Box>
        </SimpleGrid>
      </Container>
    </>
  )
}
