import { useMutation } from '@apollo/client';
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Stack,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { t, Trans } from '@lingui/macro';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useForm, useWatch } from 'react-hook-form';

import { useNavigate } from 'react-router-dom';

import type { CollectionWithColumnDetails } from 'src/graphql/index.ts';
import {
  COLUMN_DEFS_UPDATE,
  COLUMN_DEFS_INPUT_VALIDATION,
} from 'src/graphql/index.ts';
import type { ColumnDef } from 'src/graphql/schema.d.ts';

import GraphQLErrorDisplay from './GraphQLErrorDisplay.tsx';
import { Link } from './Link.tsx';

interface ColumnManagementFormProps {
  collection: CollectionWithColumnDetails['collection'];
  columnHeader: string | undefined;
  locale: string;
}

const ColumnManagementForm = function ({
  collection,
  columnHeader,
  locale,
}: ColumnManagementFormProps) {
  const toast = useToast();
  const navigate = useNavigate();
  const [updateColumnDefs, { loading: updateLoading, error: updateError }] =
    useMutation(COLUMN_DEFS_UPDATE);
  const [validateColumnDefs] = useMutation(COLUMN_DEFS_INPUT_VALIDATION);

  const getUpdatedColumnDefs = useCallback(
    (data: ColumnDef) => {
      const mutationFields = [
        'header',
        'name_en',
        'name_fr',
        'description_en',
        'description_fr',
        'data_type',
        'conditions',
      ];
      const updatedColumnDefs = collection.column_defs.map((col) =>
        col.header === columnHeader
          ? _.pick({ ...col, ...data }, mutationFields)
          : _.pick(col, mutationFields),
      );

      if (!columnHeader) {
        const newColumn = _.pick(data, mutationFields);
        updatedColumnDefs.push({
          ...newColumn,
          header: newColumn.header || '',
        });
      }
      return updatedColumnDefs;
    },
    [collection.column_defs, columnHeader],
  );

  // Errors during column def updates are captured by the error state of the mutation
  const onSubmit = async (formData: ColumnDef) => {
    const updatedColumnDefs = getUpdatedColumnDefs(formData);
    const response = await updateColumnDefs({
      variables: {
        collection_id: collection.id,
        column_defs: updatedColumnDefs,
      },
    });
    if (response.data) {
      const { id } = response.data.update_column_defs;
      if (!id) {
        throw Error(t`Missing ID for updated collection`);
      }
      toast({
        title: <Trans>Collection Updated</Trans>,
        description: <Trans>The collection has been updated</Trans>,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate(`/manage-collection/${id}`);
    }
  };
  const { register, handleSubmit, setValue, control } = useForm<ColumnDef>();
  const [isValid, setIsValid] = useState<boolean>(true);

  const watchedFields = useWatch({ control });

  const debouncedValidateColumnDefs = useMemo(
    () =>
      _.debounce(async (columnDefs: Partial<ColumnDef>[]) => {
        try {
          const result = await validateColumnDefs({
            variables: {
              collection_id: collection.id,
              column_defs: columnDefs,
            },
          });
          setIsValid(result.data.validate_new_column_defs);
        } catch (e) {
          console.error(`Error validating column definitions:${e}`);
          setIsValid(false);
        }
      }, 1000),
    [collection.id, validateColumnDefs],
  );

  useEffect(() => {
    let column;
    if (collection && columnHeader) {
      if (columnHeader) {
        column = collection.column_defs.find(
          (col) => col.header === columnHeader,
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
  }, [collection, columnHeader, setValue]);

  useEffect(() => {
    const updatedColumnDefs = getUpdatedColumnDefs(watchedFields);

    debouncedValidateColumnDefs(updatedColumnDefs);

    return () => {
      debouncedValidateColumnDefs.cancel();
    };
  }, [debouncedValidateColumnDefs, getUpdatedColumnDefs, watchedFields]);
  return (
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
            <Button
              loadingText={t`Updating column`}
              isLoading={updateLoading}
              isDisabled={!isValid}
              type="submit"
              colorScheme="blue"
              size="lg"
            >
              <Trans>Update Column</Trans>
            </Button>
            <Button
              as={Link}
              to={`/manage-collection/${collection.id}`}
              colorScheme="gray"
              size="lg"
            >
              <Trans>Go Back</Trans>
            </Button>
          </HStack>
          {updateError && <GraphQLErrorDisplay error={updateError} />}
          {!isValid && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              <AlertTitle mr={2}>
                <Trans>Validation Error</Trans>
              </AlertTitle>
              <AlertDescription>
                <Trans>
                  The current column definitions are invalid. Please check your
                  inputs.
                </Trans>
              </AlertDescription>
            </Alert>
          )}
        </Stack>
      </form>
    </Container>
  );
};

export default ColumnManagementForm;
