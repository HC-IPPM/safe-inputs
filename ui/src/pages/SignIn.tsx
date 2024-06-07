import { Box, Container } from '@chakra-ui/react';

import { Trans } from '@lingui/macro';

import { useSession } from '../components/auth/session.tsx';
import SignInForm from '../components/auth/SignInForm.tsx';

export default function SignIn() {
  const { status } = useSession({
    allow_unauthenticated: true,
  });

  const content = (() => {
    if (status === 'authenticated') {
      return <>authenticated</>;
    } else if (status === 'loading') {
      return <>loading</>;
    } else if (status === 'unauthenticated') {
      return <SignInForm />;
    } else {
      throw new Error('Unknown authentication status!');
    }
  })();

  // TODO: bad page boilerplate, staying consistent with other pages for now but I've opened issues to clean them all up
  return (
    <>
      <Box className="App-header" mb={2}>
        <Trans>Sign In</Trans>
      </Box>
      <Container maxW="7xl" px={{ base: 5, md: 10 }} mt={8} minH="63vh">
        {content}
      </Container>
    </>
  );
}
