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

import { useCollectionInfoForCurrentSession } from 'src/graphql/index.ts';
import type { CollectionInfoResult } from 'src/graphql/index.ts';

const CollectionTable = ({
  tableCaption,
  collections,
  getLinks,
}: {
  tableCaption: string;
  collections: CollectionInfoResult[] | undefined;
  getLinks: (
    collection: CollectionInfoResult,
  ) => { route: string; text: string }[];
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
              {_.map(getLinks(collection), ({ route, text }) => (
                <Td key={route}>
                  <Button as={Link} to={route}>
                    {text}
                  </Button>
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      {typeof collections === 'undefined' ||
        (_.isEmpty(collections) && (
          <Text textAlign="center">
            <Trans>You have no collections at this time</Trans>
          </Text>
        ))}
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

  const { loading, error, data, refetch } = useCollectionInfoForCurrentSession({
    variables: { lang: locale },
    fetchPolicy: 'no-cache',
  });

  if (!loading && data?.session === null) {
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
              <Button as={Link} to="/admin">
                <Trans>Admin Dashboard</Trans>
              </Button>
            )}
            {session.can_own_collections && (
              <IconButton
                aria-label={t`Create new collection`}
                title={t`Create new collection`}
                icon={<AddIcon />}
                as={Link}
                to="/create-collection"
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
            collections={data?.session?.owned_collections}
            getLinks={({ id }) => [
              { route: `/manage-collection/${id}`, text: t`Manage` },
              { route: `/upload-records/${id}`, text: t`Upload` },
            ]}
          />
        )}
        <CollectionTable
          tableCaption={t`Collections You Upload To`}
          collections={data?.session?.uploadable_collections}
          getLinks={({ id }) => [
            { route: `/upload-records/${id}`, text: t`Upload` },
          ]}
        />
      </LoadingBlock>
    );
  }
});

export default function Home() {
  const { status, session } = useSession({ allow_unauthenticated: false });

  const has_session = session !== null;

  // TODO: bad page boilerplate, staying consistent with other pages for now but I've opened issues to clean them all up
  return (
    <>
      <Box className="App-header" mb={2}>
        <h1>
          <Trans>Safe Inputs Home</Trans>
        </h1>
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
