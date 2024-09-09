import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  useToast,
  HStack,
} from '@chakra-ui/react';
import { Trans } from '@lingui/macro';

import { useLingui } from '@lingui/react';
import _ from 'lodash';
import React, { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { Session } from 'src/components/auth/auth_utils.ts';

import { useSession } from 'src/components/auth/session.tsx';
import GraphQLErrorDisplay from 'src/components/GraphQLErrorDisplay.tsx';
import { Link } from 'src/components/Link.tsx';
import { LoadingBlock } from 'src/components/Loading.tsx';
import { ColumnDef, User } from 'src/schema/utils.ts';

const GET_COLUMN_DETAILS = gql`
  query ColumnDetails($collection_id: String!, $lang: String!) {
    collection(collection_id: $collection_id) {
      is_current_version
      major_ver
      minor_ver
      created_by {
        email
      }
      owners {
        email
      }
      created_at
      is_locked
      name(lang: $lang)
      column_defs {
        header
        name_en
        name_fr
        description_en
        description_fr
        data_type
        conditions {
          condition_type
          parameters
        }
      }
    }
  }
`;

const UPDATE_COLUMN_DEFINITION = gql`
  mutation ColumnUpdate(
    $collection_id: String!
    $column_defs: [ColumnDefInput]
  ) {
    update_column_defs(
      collection_id: $collection_id
      column_defs: $column_defs
    ) {
      id
    }
  }
`;

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

const ColumnManagement = memo(function ColumnManagement({
  session,
}: {
  session: Session;
}) {
  const { collectionID, columnHeader } = useParams();
  const navigate = useNavigate();
  const {
    i18n: { locale },
  } = useLingui();
  const { loading, error, data } = useQuery(GET_COLUMN_DETAILS, {
    variables: { collection_id: collectionID, lang: locale },
    fetchPolicy: 'no-cache',
  });

  const [updateColumnDefs, { error: updateError }] = useMutation(
    UPDATE_COLUMN_DEFINITION,
  );
  const toast = useToast();

  const { register, handleSubmit, setValue } = useForm<ColumnDef>();

  useEffect(() => {
    let column;
    if (data && columnHeader) {
      if (columnHeader) {
        column = data.collection.column_defs.find(
          (col: ColumnDef) => col.header === columnHeader,
        );
      }
    }
    setValue('header', column?.header || '');
    setValue('name_en', column?.name_en || '');
    setValue('name_fr', column?.name_fr || '');
    setValue('description_en', column?.description_en || '');
    setValue('description_fr', column?.description_fr || '');
    setValue('data_type', column?.data_type || '');
    setValue('conditions', column?.conditions || []);
  }, [data, columnHeader, setValue]);

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
    !data.collection.owners.some((owner: User) => owner.email === session.email)
  ) {
    return (
      <ErrorDisplay
        title={<Trans>Permission Denied</Trans>}
        message={
          <Trans>
            You do not have access to edit this collection. Please ask a team
            member with owner permissions to grant access.
          </Trans>
        }
      />
    );
  } else if (error) {
    throw error;
  } else {
    const onSubmit = async (formData: ColumnDef) => {
      try {
        const mutationFields = [
          'header',
          'name_en',
          'name_fr',
          'description_en',
          'description_fr',
          'data_type',
          'conditions',
        ];

        const updatedColumnDefs = data.collection.column_defs.map(
          (col: ColumnDef) =>
            col.header === columnHeader
              ? _.pick({ ...col, ...formData }, mutationFields)
              : _.pick(col, mutationFields),
        );

        if (!columnHeader) {
          const newColumn = _.pick(formData, mutationFields);
          updatedColumnDefs.push(newColumn);
        }

        const response = await updateColumnDefs({
          variables: {
            collection_id: collectionID,
            column_defs: updatedColumnDefs,
          },
        });
        if (response.data) {
          const { id } = response.data.update_column_defs;
          toast({
            title: <Trans>Collection Updated</Trans>,
            description: (
              <Trans>
                The collection has been updated with given column definitions
              </Trans>
            ),
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          navigate(`/manage-collection/${id}`);
        }
      } catch (err) {
        console.error(err);
      }
    };

    return (
      <LoadingBlock isLoading={loading} flexDir={'column'}>
        {data && (
          <Container maxW="5xl" py={8}>
            <Heading as="h2" size="md" mb={6}>
              {columnHeader ? (
                <Trans>
                  Edit Column: <strong>{columnHeader}</strong>
                </Trans>
              ) : (
                <Trans>Add Column</Trans>
              )}
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                <FormControl isRequired isDisabled={!!columnHeader}>
                  <FormLabel>
                    <Trans>Header</Trans>
                  </FormLabel>
                  <Input {...register('header')} />
                </FormControl>
                <FormControl id="name_en" isRequired>
                  <FormLabel>
                    <Trans>Name (English)</Trans>
                  </FormLabel>
                  <Input {...register('name_en')} />
                </FormControl>
                <FormControl id="name_fr" isRequired>
                  <FormLabel>
                    <Trans>Name (French)</Trans>
                  </FormLabel>
                  <Input {...register('name_fr')} />
                </FormControl>
                <FormControl id="description_en" isRequired>
                  <FormLabel>
                    <Trans>Description (English)</Trans>
                  </FormLabel>
                  <Input {...register('description_en')} />
                </FormControl>
                <FormControl id="description_fr" isRequired>
                  <FormLabel>
                    <Trans>Description (French)</Trans>
                  </FormLabel>
                  <Input {...register('description_fr')} />
                </FormControl>
                <FormControl id="data_type" isRequired>
                  <FormLabel>
                    <Trans>Data Type</Trans>
                  </FormLabel>
                  <Select
                    {...register('data_type')}
                    placeholder={
                      locale === 'en'
                        ? 'Please select datatype'
                        : 'Veuillez sélectionner le type de données'
                    }
                  >
                    <option value="string">
                      <Trans>String</Trans>
                    </option>
                    <option value="number">
                      <Trans>Number</Trans>
                    </option>

                    <option value="boolean">
                      <Trans>Boolean</Trans>
                    </option>
                    <option value="array">
                      <Trans>Array</Trans>
                    </option>
                    <option value="object">
                      <Trans>Object</Trans>
                    </option>
                    <option value="date">
                      <Trans>Date</Trans>
                    </option>
                    <option value="date-time">
                      <Trans>Date-Time</Trans>
                    </option>
                  </Select>
                </FormControl>
                <HStack spacing={4}>
                  <Button type="submit" colorScheme="blue" size="lg">
                    <Trans>Update Column</Trans>
                  </Button>
                  <Button
                    as={Link}
                    to={`/manage-collection/${collectionID}`}
                    colorScheme="gray"
                    size="lg"
                  >
                    <Trans>Go Back</Trans>
                  </Button>
                </HStack>
                {updateError && <GraphQLErrorDisplay error={updateError} />}
              </Stack>
            </form>
          </Container>
        )}
      </LoadingBlock>
    );
  }
});

export default function ColumnManagementPage() {
  const { status, session } = useSession();

  const has_session = session !== null;

  const navigate = useNavigate();

  if (has_session && !session?.can_own_collections) {
    navigate('/');
  }

  return (
    <>
      <Box className="App-header" mb={2}>
        <Trans>Column Management</Trans>
      </Box>
      <Container
        maxW="7xl"
        px={{ base: 5, md: 10 }}
        mt={8}
        minH="63vh"
        display={'flex'}
      >
        <LoadingBlock isLoading={status === 'syncing' && !has_session}>
          {has_session && <ColumnManagement session={session} />}
        </LoadingBlock>
      </Container>
    </>
  );
}
