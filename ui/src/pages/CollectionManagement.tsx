import { Trans } from '@lingui/react/macro';

import {
  Box,
  Button,
  Container,
  Divider,
  Heading,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from '@chakra-ui/react';
import { useLingui } from '@lingui/react';

import _ from 'lodash';

import React, { memo } from 'react';
import { useNavigate, useParams } from 'react-router';

import type { Session } from 'src/components/auth/auth_utils.ts';
import { useSession } from 'src/components/auth/session.tsx';
import { CollectionManagementForm } from 'src/components/CollectionManagementForm.tsx';
import { Link } from 'src/components/Link.tsx';
import { LoadingBlock } from 'src/components/Loading.tsx';
import { useCollectionDetails } from 'src/graphql/index.ts';

const ErrorDisplay = function ({
  title,
  message,
}: {
  title: React.ReactNode;
  message: React.ReactNode;
}) {
  return (
    <div style={{ height: '50%' }} className="error-container">
      <h2>{title}</h2>
      <div className="error-message">{message}</div>
      <Link className="error-home-button" to="/">
        <Trans>Home</Trans>
      </Link>
    </div>
  );
};

const CollectionMainPage = memo(function CollectionMainPage({
  session,
}: {
  session: Session;
}) {
  const { collectionId } = useParams() as { collectionId: string };

  const {
    i18n: { locale },
  } = useLingui();

  // Fetch the latest version of the collection. Current version is updated to false backend, when changed
  const { loading, error, data } = useCollectionDetails({
    variables: { collection_id: collectionId, lang: locale },
    fetchPolicy: 'no-cache',
  });

  if (error) {
    throw error;
  } else if (!loading && !data?.collection?.is_current_version) {
    return (
      <ErrorDisplay
        title={<Trans>Cannot update stale version of Collection</Trans>}
        message={
          <Trans>
            You can only update the latest version of a collection. The
            collection you were viewing may have become stale. Please return to
            the home page and look for the latest version.
          </Trans>
        }
      />
    );
  } else if (
    !loading &&
    !data?.collection?.owners?.some(
      (owner: { email: string }) => owner.email === session.email,
    ) &&
    !session.is_super_user
  ) {
    return (
      <ErrorDisplay
        title={<Trans>Permission Denied</Trans>}
        message={
          <Trans>
            You do not have access to edit this collection. Please ask the a
            team member with owner permissions to grant you access.
          </Trans>
        }
      />
    );
  } else {
    return (
      <LoadingBlock isLoading={loading} flexDir={'column'}>
        {data && (
          <>
            <Box>
              <Heading as="h2" size="lg" mb={6}>
                <Trans>Update Collection</Trans>
              </Heading>
              <CollectionManagementForm
                collection_id={data?.collection?.id}
                initial_collection_state={_.chain(data?.collection)
                  .pick([
                    'name_en',
                    'name_fr',
                    'description_en',
                    'description_fr',
                    'owners',
                    'uploaders',
                    'is_locked',
                  ])
                  .thru(({ owners, uploaders, ...pass_through }) => ({
                    ...pass_through,
                    owner_emails: _.map(owners, 'email'),
                    uploader_emails: _.map(uploaders, 'email'),
                  }))
                  .value()}
              />
            </Box>

            <Divider orientation="horizontal" mt={8} mb={8} />

            <Box>
              <Heading as="h2" size="lg" mb={6}>
                <Trans>Columns Overview</Trans>
              </Heading>

              <Stack spacing={4} mb={6}>
                {data?.collection?.column_defs.length > 0 ? (
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>
                          <Trans>Header</Trans>
                        </Th>
                        <Th>
                          <Trans>Name</Trans>
                        </Th>
                        <Th>
                          <Trans>Data Type</Trans>
                        </Th>
                        <Th>
                          <Trans>Conditions</Trans>
                        </Th>
                        <Th>
                          <Trans>Actions</Trans>
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.collection?.column_defs.map((column) => (
                        <Tr key={column.header}>
                          <Td>{column.header}</Td>
                          <Td>{column.name}</Td>
                          <Td>{column.data_type}</Td>
                          <Td>
                            {column.conditions.map((condition, index) => (
                              <Box key={index}>
                                <Text>{condition.condition_type}</Text>
                                <Text fontSize="sm" color="gray.500">
                                  {JSON.stringify(condition.parameters)}
                                </Text>
                              </Box>
                            ))}
                          </Td>
                          <Td>
                            <Button
                              as={Link}
                              to={`/manage-collection/${collectionId}/edit-column/${column.id}`}
                              colorScheme="blue"
                              size="sm"
                              mr={2}
                            >
                              <Trans>Edit</Trans>
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                ) : (
                  <Text>
                    <Trans>No columns available.</Trans>
                  </Text>
                )}
              </Stack>

              <Button
                as={Link}
                to={`/manage-collection/${collectionId}/create-column`}
                size="md"
              >
                <Trans>Add New Column</Trans>
              </Button>
            </Box>
          </>
        )}
      </LoadingBlock>
    );
  }
});

export default function CollectionManagement() {
  const { status, session } = useSession();

  const has_session = session !== null;

  const navigate = useNavigate();

  if (has_session && !session?.can_own_collections) {
    navigate('/');
  }

  return (
    <>
      <Box className="App-header" mb={2}>
        <h1>
          <Trans>Collection Management</Trans>
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
          {has_session && <CollectionMainPage session={session} />}
        </LoadingBlock>
      </Container>
    </>
  );
}
