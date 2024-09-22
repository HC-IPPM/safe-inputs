import { useQuery } from '@apollo/client';

import {
  Box,
  Button,
  Container,
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
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import React, { memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import type { Session } from 'src/components/auth/auth_utils.ts';
import { useSession } from 'src/components/auth/session.tsx';
import CollectionForm from 'src/components/CollectionForm.tsx';

import { Link } from 'src/components/Link.tsx';

import { LoadingBlock } from 'src/components/Loading.tsx';
import { GET_COLLECTION_DETAILS } from 'src/graphql/index.ts';
import type { ColumnDef } from 'src/graphql/schema.d.ts';

const ErrorDisplay = function ({
  title,
  message,
  homeButton = true,
}: {
  title: React.ReactNode;
  message: React.ReactNode;
  homeButton?: boolean;
}) {
  return (
    <div style={{ height: '50%' }} className="error-container">
      <h2>{title}</h2>
      <div className="error-message">{message}</div>
      {homeButton && (
        <Link className="error-home-button" to="/">
          <Trans>Go to Home</Trans>
        </Link>
      )}
    </div>
  );
};

const CollectionMainPage = memo(function CollectionMainPage({
  session,
}: {
  session: Session;
}) {
  const { collectionID } = useParams();

  const {
    i18n: { locale },
  } = useLingui();
  const navigate = useNavigate();

  // Fetch the latest version of the collection. Current version is updated to false backend, when changed
  const { loading, error, data } = useQuery(GET_COLLECTION_DETAILS, {
    variables: { collection_id: collectionID, lang: locale },
    fetchPolicy: 'no-cache',
  });

  if (!loading && !data.collection.is_current_version) {
    setTimeout(() => {
      navigate('/');
    }, 5000);
    return (
      <ErrorDisplay
        title={<Trans>Cannot update stale version of Collection</Trans>}
        message={
          <Trans>
            You can only update the latest version of a collection. You will be
            redirected back shortly.
          </Trans>
        }
        homeButton={false}
      />
    );
  } else if (
    !loading &&
    !data.collection.owners?.some(
      (owner: { email: string }) => owner.email === session.email,
    )
  ) {
    return (
      <ErrorDisplay
        title={<Trans>Permission Denied</Trans>}
        message={
          <Trans>
            You do not have access to edit this collection. Please ask the a
            team member with owner permissions to grant access.
          </Trans>
        }
      />
    );
  } else if (error) {
    throw error;
  } else {
    return (
      <LoadingBlock isLoading={loading} flexDir={'column'}>
        {data && (
          <>
            <CollectionForm data={data?.collection} />
            <Box mt={8}>
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
                      {data?.collection?.column_defs.map(
                        (column: ColumnDef) => (
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
                                to={`/manage-collection/${collectionID}/edit-column/${column.header}`}
                                colorScheme="blue"
                                size="sm"
                                mr={2}
                              >
                                <Trans>Edit</Trans>
                              </Button>
                            </Td>
                          </Tr>
                        ),
                      )}
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
                to={`/manage-collection/${collectionID}/create-column`}
                colorScheme="green"
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

export default function CollectionManagementPage() {
  const { status, session } = useSession();

  const has_session = session !== null;

  const navigate = useNavigate();

  if (has_session && !session?.can_own_collections) {
    navigate('/');
  }

  return (
    <>
      <Box className="App-header" mb={2}>
        <Trans>Collection Management</Trans>
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
