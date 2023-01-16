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

export default function FooterConcept1() {
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
        color="#333333"
      >
        <Container maxW="7xl" px={10} color="#FFFFFF">
          <SimpleGrid
            columns={[1, null, 3]}
            gap={[2, null, 10]}
            py={2}
            color="#FFFFFF"
          >
            <Box>
              <Stack>
                <Link href={`${t('footer.contactUsLink')}`} {...LinkStyle}>
                  <Text>{t('footer.contactUs')}</Text>
                </Link>
                <Link
                  href={`${t('footer.departmentsAgenciesLink')}`}
                  {...LinkStyle}
                >
                  <Text>{t('footer.departmentsAgencies')}</Text>
                </Link>
                <Link
                  href={`${t('footer.publicServiceMilitaryLink')} `}
                  {...LinkStyle}
                >
                  <Text>{t('footer.publicServiceMilitary')}</Text>
                </Link>
              </Stack>
            </Box>
            <Box>
              <Stack>
                <Link href={`${t('footer.newsLink')} `} {...LinkStyle}>
                  <Text>{t('footer.news')}</Text>
                </Link>
                <Link
                  href={`${t('footer.treatiesLawsRegulationsLink')} `}
                  {...LinkStyle}
                >
                  <Text>{t('footer.treatiesLawsRegulations')}</Text>
                </Link>
                <Link
                  href={`${t('footer.governmentReportingLink')} `}
                  {...LinkStyle}
                >
                  <Text>{t('footer.governmentReporting')}</Text>
                </Link>
              </Stack>
            </Box>
            <Box>
              <Stack>
                <Link href={`${t('footer.primeMinisterLink')} `} {...LinkStyle}>
                  <Text>{t('footer.primeMinister')}</Text>
                </Link>
                <Link
                  href={`${t('footer.aboutGovernmentLink')} `}
                  {...LinkStyle}
                >
                  <Text>{t('footer.aboutGovernment')}</Text>
                </Link>
                <Link
                  href={`${t('footer.openGovernmentLink')} `}
                  {...LinkStyle}
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
        <SimpleGrid columns={[1, null, 7]} gap={1} py={5} color="#00587f">
          <Box minW="80px">
            <Link href={`${t('footer.termsConditionsLink')} `} {...LinkStyle}>
              <Text>{t('footer.termsConditions')}</Text>
            </Link>
          </Box>
          <Box minW="120px">
            <Link href={`${t('footer.privacyLink')} `} {...LinkStyle}>
              <Text>{t('footer.privacy')}</Text>
            </Link>
          </Box>
          <Box minW="80px">
            <Link href={`${t('footer.socialMediaLink')} `} {...LinkStyle}>
              <Text>{t('footer.socialMedia')}</Text>
            </Link>
          </Box>
          <Box>
            <Link href={`${t('footer.mobileApplicationLink')} `} {...LinkStyle}>
              <Text>{t('footer.mobileApplication')}</Text>
            </Link>
          </Box>
          <Box minW="80px">
            <Link href={`${t('footer.aboutCanadaCaLink')} `} {...LinkStyle}>
              <Text>{t('footer.aboutCanadaCa')}</Text>
            </Link>
          </Box>
          <Box minW="10px"></Box>
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
      </Container>
    </>
  )
}
