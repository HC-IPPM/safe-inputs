import { Box, Container } from '@chakra-ui/react';
import { Trans } from '@lingui/react/macro';

import { useNavigate, useSearchParams } from 'react-router';

import { useSession } from 'src/components/auth/session.tsx';
import SignInForm from 'src/components/auth/SignInForm.tsx';

export default function SignIn() {
  const navigate = useNavigate();
  const [URLSearchParams] = useSearchParams();
  const post_auth_redirect =
    URLSearchParams.get('post_auth_redirect') || undefined;

  const { status } = useSession({
    allow_unauthenticated: true,
  });

  if (status === 'authenticated') {
    if (post_auth_redirect?.startsWith('/')) {
      navigate(post_auth_redirect);
    } else {
      navigate('/');
    }
  }

  // TODO: bad page boilerplate, staying consistent with other pages for now but I've opened issues to clean them all up
  return (
    <>
      <Box className="App-header" mb={2}>
        <h1>
          <Trans>Sign In</Trans>
        </h1>
      </Box>
      <Container maxW="7xl" px={{ base: 5, md: 10 }} mt={8} minH="63vh">
        <SignInForm post_auth_redirect={post_auth_redirect} />
      </Container>
    </>
  );
}
