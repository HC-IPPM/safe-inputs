import { gql, useQuery } from '@apollo/client';

import { RepeatIcon } from '@chakra-ui/icons';
import { Box, Container, IconButton } from '@chakra-ui/react';

import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { memo } from 'react';

import type { Session } from 'src/components/auth/auth_utils.ts';
import { useSession } from 'src/components/auth/session.tsx';
import { LoadingBlock } from 'src/components/Loading.tsx';

const GET_HOME_INFO = gql`
  query HomePageInfo($lang: String!) {
    query_root(lang: $lang) {
      session {
        owned_collections {
          id
          name
          major_ver
          minor_ver
          is_locked
          created_by {
            email
          }
          created_at
        }
        uploadable_collections {
          id
          name
          major_ver
          minor_ver
          is_locked
          created_by {
            email
          }
          created_at
        }
      }
    }
  }
`;

// memoizing on session so that the session sync on browser focus won't trigger rerenders
// TODO: most routes will deal with this, bake it in to some sort of route level component
// (along with other things to standardize like headers and container layouts)
const HomeDynamic = memo(function HomeDynamic({
  session,
}: {
  session: Session;
}) {
  const {
    i18n: { locale },
  } = useLingui();

  const { loading, error, data, refetch } = useQuery(GET_HOME_INFO, {
    // user is not a variable used in this query, but it is passed for cache keying purposes
    variables: { lang: locale, user: session.email },
  });

  if (error) {
    throw error;
  }

  return (
    <LoadingBlock isLoading={loading} flexDir={'column'}>
      {data && JSON.stringify(data)}
      {session.is_super_user && <div>TODO link to admin page</div>}
      {session.can_own_collections && (
        <div>TODO link to collection creation page</div>
      )}
      <IconButton
        aria-label={t`Refresh collection lists`}
        icon={<RepeatIcon />}
        onClick={() => refetch()}
      />
    </LoadingBlock>
  );
});

export default function Home() {
  const { status, session } = useSession();

  const has_session = session !== null;

  return (
    <>
      <Box className="App-header" mb={2}>
        <Trans>Safe Inputs Home</Trans>
      </Box>
      <Container
        maxW="7xl"
        px={{ base: 5, md: 10 }}
        mt={8}
        minH="63vh"
        display={'flex'}
      >
        <LoadingBlock isLoading={status === 'syncing' && !has_session}>
          {has_session && <HomeDynamic session={session} />}
        </LoadingBlock>
      </Container>
    </>
  );
}
