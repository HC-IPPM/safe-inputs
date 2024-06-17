import { HStack, Box, Container } from '@chakra-ui/react';

import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import CanadaLogoEn from '../../assets/sig-blk-en.svg';
import CanadaLogoFr from '../../assets/sig-blk-fr.svg';
import AuthNavButton from '../auth/AuthNavButton.tsx';
import LanguageButton from '../LanguageButton.tsx';
import { RouterLink } from '../RouterLink.tsx';

const NavButtonStyle = {
  h: '30px',
  margin: '0',
  bg: 'transparent',
  outline: 'varient',
  color: '#333333',
  border: '1px',
  borderColor: '#333333',
  _hover: {
    color: '#FFFFFF',
    bg: '#26374A',
    textDecor: 'underline',
    borderColor: '#FFFFFF',
  },
};

export default function Header() {
  const { i18n } = useLingui();

  return (
    <>
      <Box bg="#EEEEEE">
        <Container maxW="7xl" px={{ base: 5, md: 10 }} py={4}>
          <HStack justify="space-between">
            <RouterLink
              to="/"
              bg="transparent"
              h="auto"
              _hover={{
                bg: 'transparent',
              }}
              maxW={{ base: '250px', sm: '300px', md: '365px', lg: '400px' }}
              minW={{ base: '180px', sm: '265px', md: '400px', lg: '365px' }}
            >
              {i18n.locale === 'en' ? <CanadaLogoEn /> : <CanadaLogoFr />}
            </RouterLink>
            <HStack spacing="2">
              <AuthNavButton {...NavButtonStyle} />
              <LanguageButton {...NavButtonStyle} />
              <RouterLink to="/">
                <Trans>Home</Trans>
              </RouterLink>
            </HStack>
          </HStack>
        </Container>
      </Box>
    </>
  );
}
