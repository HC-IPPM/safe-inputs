import { gql, useQuery } from '@apollo/client';

import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import {
  Box,
  Container,
  IconButton,
  HStack,
  Button,
  Heading,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  Tag,
} from '@chakra-ui/react';

import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import _ from 'lodash';

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

// TODO at some point, I'll integrate a tool to generate types from queries
type CollectionInfo = {
  id: string;
  name: string;
  major_ver: number;
  minor_ver: number;
  is_locked: boolean;
  created_by: {
    email: string;
  };
  created_at: number;
};

const CollectionTable = ({
  tableCaption,
  collections,
  getLinks,
}: {
  tableCaption: string;
  collections: CollectionInfo[];
  getLinks: (collection: CollectionInfo) => { href: string; text: string }[];
}) => {
  const {
    i18n: { locale },
  } = useLingui();

  return (
    <TableContainer mb={4}>
      <Table variant="simple">
        <TableCaption placement="top">
          <Heading>{tableCaption}</Heading>
        </TableCaption>
        <Thead>
          <Tr>
            <Th>
              <Trans>Name</Trans>
            </Th>
            <Th>
              <Trans>Version</Trans>
            </Th>
            <Th>
              <Trans>Created by</Trans>
            </Th>
            <Th>
              <Trans>Created at</Trans>
            </Th>
            <Th>
              <Trans>Status</Trans>
            </Th>
            <Th
              colSpan={
                _.chain(collections)
                  .map((collection) => getLinks(collection).length)
                  .max()
                  .value() || 1
              }
            >
              <Trans>Actions</Trans>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {_.map(collections, (collection) => (
            <Tr key={collection.id}>
              <Td>{collection.name}</Td>
              <Td>{`${collection.major_ver}.${collection.minor_ver}`}</Td>
              <Td>{collection.created_by.email}</Td>
              <Td>
                {new Intl.DateTimeFormat(`${locale}-CA`, {
                  dateStyle: 'short',
                  timeStyle: 'short',
                }).format(new Date(collection.created_at))}
              </Td>
              <Td>
                <Tag
                  size={'md'}
                  borderRadius="full"
                  variant="solid"
                  colorScheme={collection.is_locked ? 'red' : 'green'}
                  width={'100%'}
                  justifyContent={'center'}
                >
                  {collection.is_locked ? t`Closed` : t`Open`}
                </Tag>
              </Td>
              {_.map(getLinks(collection), ({ href, text }) => (
                <Td key={href}>
                  <Button as={Link} to={href}>
                    {text}
                  </Button>
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      {_.isEmpty(collections) && (
        <Text textAlign="center">
          <Trans>You have no collections at this time</Trans>
        </Text>
      )}
    </TableContainer>
  );
};

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
    variables: { lang: locale },
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
              onClick={() => refetch({ lang: locale })}
            />
          </HStack>
        </nav>
        {session.can_own_collections && (
          <CollectionTable
            tableCaption={t`Collections You Manage`}
            collections={data?.query_root?.session?.owned_collections}
            getLinks={({ id }) => [
              { href: 'TODO', text: t`Manage` },
              { href: 'TODO', text: t`Upload` },
            ]}
          />
        )}
        <CollectionTable
          tableCaption={t`Collections You Upload To`}
          collections={data?.query_root?.session?.uploadable_collections}
          getLinks={({ id }) => [{ href: 'TODO', text: t`Upload` }]}
        />
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
