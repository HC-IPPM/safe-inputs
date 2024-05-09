import { Trans } from '@lingui/macro';
import { HStack, Box, Container, Link } from '@chakra-ui/react';

import LanguageButton from '../LanguageButton.tsx';

import CanadaLogoEn from '../../assets/sig-blk-en.svg';
import CanadaLogoFr from '../../assets/sig-blk-fr.svg';
import { useLingui } from '@lingui/react';

export default function Header() {
  const { i18n } = useLingui();

  return (
    <>
      <Box bg="#EEEEEE">
        <Container maxW="7xl" px={{ base: 5, md: 10 }} py={4}>
          <HStack justify="space-between">
            <Link
              bg="transparent"
              h="auto"
              _hover={{
                bg: 'transparent',
              }}
              maxW={{ base: '250px', sm: '300px', md: '365px', lg: '400px' }}
              minW={{ base: '180px', sm: '265px', md: '400px', lg: '365px' }}
              href="/"
            >
              {i18n.locale == 'en' ? <CanadaLogoEn /> : <CanadaLogoFr />}
            </Link>
            <HStack>
              <Link href="/">
                <Trans>Home</Trans>
              </Link>
              <LanguageButton />
            </HStack>
          </HStack>
        </Container>
      </Box>
    </>
  );
}
