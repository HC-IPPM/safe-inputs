import type { ButtonProps } from '@chakra-ui/react';
import { Text, Button } from '@chakra-ui/react';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';

import { useLocation } from 'react-router';

import { useSpinDelay } from 'spin-delay';

import { Link } from 'src/components/Link.tsx';

import { get_sign_in_path } from './auth_utils.ts';
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
        <Text>{session?.email}</Text>
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
            : get_sign_in_path({
                post_auth_redirect: pathname + (search || ''),
              })
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
