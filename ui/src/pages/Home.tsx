import { gql, useQuery } from '@apollo/client';

import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import {
  Box,
  Container,
  IconButton,
  HStack,
  Button,
  Heading,
} from '@chakra-ui/react';

import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { memo } from 'react';

import { useNavigate } from 'react-router-dom';

import type { Session } from 'src/components/auth/auth_utils.ts';
import { get_sign_in_path } from 'src/components/auth/auth_utils.ts';
import { useSession } from 'src/components/auth/session.tsx';
import { Link } from 'src/components/Link.tsx';
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
  const navigate = useNavigate();

  const {
    i18n: { locale },
  } = useLingui();

  const { loading, error, data, refetch } = useQuery(GET_HOME_INFO, {
    // user is not a variable used in this query, but it is passed for cache keying purposes
    variables: { lang: locale, user: session.email },
  });

  if (!loading && data.query_root.session === null) {
    navigate(
      get_sign_in_path({
        post_auth_redirect: '',
        message: 'SessionRequired',
      }),
    );
  } else if (error) {
    throw error;
  } else {
    return (
      <LoadingBlock isLoading={loading} flexDir={'column'}>
        <nav>
          <HStack justify={'right'}>
            {session.is_super_user && (
              <Button as={Link} to="TODO">
                <Trans>Admin Dashboard</Trans>
              </Button>
            )}
            {session.can_own_collections && (
              <IconButton
                aria-label={t`Create new collection`}
                title={t`Create new collection`}
                icon={<AddIcon />}
                as={Link}
                to="TODO"
              />
            )}
            <IconButton
              aria-label={t`Refresh collection lists`}
              title={t`Refresh collection lists`}
              icon={<RepeatIcon />}
              onClick={() => refetch()}
            />
          </HStack>
        </nav>
        {session.can_own_collections && (
          <Box as="section" mb={4}>
            <Heading as="h2">
              <Trans>Collections You Manage</Trans>
            </Heading>
            {data && JSON.stringify(data.query_root.session.owned_collections)}
          </Box>
        )}
        <Box as="section" mb={4}>
          <Heading as="h2">
            <Trans>Collections You Upload To</Trans>
          </Heading>
          {data &&
            JSON.stringify(data.query_root.session.uploadable_collections)}
        </Box>
      </LoadingBlock>
    );
  }
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
