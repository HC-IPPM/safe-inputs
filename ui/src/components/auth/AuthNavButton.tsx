import type { ButtonProps } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';

import { Trans, t } from '@lingui/macro';

import { useLocation } from 'react-router-dom';

import { useSession } from './session.tsx';

export default function AuthNavButton(StyleProps: ButtonProps): JSX.Element {
  useLocation(); // re-render on route change, to sync callbackUrl value

  const { status, session, signOut } = useSession({
    allow_unauthenticated: true,
  });

  if (status === 'loading') {
    return (
      <Button
        {...StyleProps}
        isLoading={true}
        loadingText={t`Checking session...`}
        as="button"
      ></Button>
    );
  } else if (session?.user) {
    return (
      <>
        {session.user?.email}
        <Button {...StyleProps} onClick={() => signOut()} as="button">
          <Trans>Sign Out</Trans>
        </Button>
      </>
    );
  } else {
    return (
      <Button
        {...StyleProps}
        href={`/signin?${new URLSearchParams({
          callbackUrl: window.location.href,
        })}`}
        as="a"
      >
        <Trans>Sign In</Trans>
      </Button>
    );
  }
}
