import type { ButtonProps } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';

import { Trans, t } from '@lingui/macro';

import { useLocation } from 'react-router-dom';

import { useSpinDelay } from 'spin-delay';

import { Link } from '../Link.tsx';

import { useSession } from './session.tsx';

export default function AuthNavButton(StyleProps: ButtonProps): JSX.Element {
  const { pathname, search } = useLocation();

  const { status, session, signOut } = useSession({
    allow_unauthenticated: true,
  });

  const showLoading = useSpinDelay(status === 'syncing');

  if (session?.email) {
    return (
      <>
        {session?.email}
        <Button
          as="button"
          {...StyleProps}
          isLoading={showLoading}
          loadingText={t`Syncing session`}
          onClick={() => signOut()}
        >
          <Trans>Sign Out</Trans>
        </Button>
      </>
    );
  } else {
    return (
      <Button
        as={Link}
        to={
          pathname.startsWith('/signin')
            ? window.location
            : `/signin?${new URLSearchParams({
                post_auth_redirect: pathname + (search || ''),
              })}`
        }
        {...StyleProps}
        isLoading={showLoading}
        loadingText={t`Syncing session`}
      >
        <Trans>Sign In</Trans>
      </Button>
    );
  }
}
