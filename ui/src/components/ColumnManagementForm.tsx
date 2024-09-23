import { useMutation } from '@apollo/client';

import {
  Button,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  HStack,
  Input,
  Select,
  Stack,
  useToast,
} from '@chakra-ui/react';

import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import debounce from 'debounce-promise';

import _ from 'lodash';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import type { CollectionWithColumnDetailsResult } from 'src/graphql/index.ts';
import {
  COLUMN_DEFS_UPDATE,
  useLazyColumnDefInputValidation,
} from 'src/graphql/index.ts';
import type { ColumnDefInput } from 'src/graphql/schema_common.d.ts';

import { GraphQLErrorDisplay } from './GraphQLErrorDisplay.tsx';

interface ColumnManagementFormProps {
  collection_id: string;
  initial_column_state:
    | CollectionWithColumnDetailsResult['collection']['column_defs'][number]
    | undefined;
}

const ColumnManagementForm = function ({
  collection_id,
  initial_column_state,
}: ColumnManagementFormProps) {
  const column_header = initial_column_state?.header;
  const is_new_column = typeof column_header === 'undefined';

  const toast = useToast();

  const navigate = useNavigate();

  const {
    i18n: { locale },
  } = useLingui();

  const [updateColumnDefs, { loading: updateLoading, error: updateError }] =
    useMutation(COLUMN_DEFS_UPDATE);

  // Errors during column def updates are captured by the error state of the mutation
  const onSubmit = async (formData: ColumnDefInput) => {
    const response = await updateColumnDefs({
      variables: {
        collection_id,
        column_defs: formData,
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

  const [lazyColumnDefInputValidation, { error: validationError }] =
    useLazyColumnDefInputValidation();
  const debounced_form_validation = debounce(
    async (form_data: ColumnDefInput) => {
      const result = await lazyColumnDefInputValidation({
        variables: {
          collection_id,
          is_new_column,
          ...form_data,
        },
      });

      const error_messages_in_current_locale = _.chain(
        result.data?.validate_column_def,
      )
        .omitBy(
          (validation_result, key) =>
            key === '__typename' || _.isNull(validation_result),
        )
        .mapValues((validation_result) => _.get(validation_result, locale))
        .value();

      return {
        values: _.isEmpty(error_messages_in_current_locale) ? form_data : {},
        errors: _.isEmpty(error_messages_in_current_locale)
          ? {}
          : error_messages_in_current_locale,
      };
    },
    250,
  );

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<ColumnDefInput>({
    defaultValues:
      typeof initial_column_state === 'undefined'
        ? {
            header: '',
            name_en: '',
            name_fr: '',
            description_en: '',
            description_fr: '',
            data_type: '',
            conditions: [],
          }
        : _.omit(initial_column_state, '__typename'),
    resolver: debounced_form_validation,
    mode: 'onChange',
  });

  // validate on initial render to get initial errors, e.g. mark required fields
  useEffect(() => {
    trigger();
  }, [trigger]);

  return (
    <Container maxW="5xl" py={8}>
      <Heading as="h2" size="md" mb={6}>
        {column_header ? (
          <Trans>Edit Column</Trans>
        ) : (
          <Trans>Create New Column</Trans>
        )}
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <FormControl
            id="header"
            isDisabled={!is_new_column}
            isInvalid={typeof errors.header === 'string'}
          >
            <FormLabel>
              <Trans>Header</Trans>
            </FormLabel>
            <Input {...register('header')} />
            {typeof errors.header === 'string' && (
              <FormErrorMessage whiteSpace={'pre-wrap'}>
                {errors.header}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            id="name_en"
            isInvalid={typeof errors.name_en === 'string'}
          >
            <FormLabel>
              <Trans>Name (English)</Trans>
            </FormLabel>
            <Input {...register('name_en')} />
            {typeof errors.name_en === 'string' && (
              <FormErrorMessage whiteSpace={'pre-wrap'}>
                {errors.name_en}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            id="name_fr"
            isInvalid={typeof errors.name_fr === 'string'}
          >
            <FormLabel>
              <Trans>Name (French)</Trans>
            </FormLabel>
            <Input {...register('name_fr')} />
            {typeof errors.name_fr === 'string' && (
              <FormErrorMessage whiteSpace={'pre-wrap'}>
                {errors.name_fr}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            id="description_en"
            isInvalid={typeof errors.description_en === 'string'}
          >
            <FormLabel>
              <Trans>Description (English)</Trans>
            </FormLabel>
            <Input {...register('description_en')} />
            {typeof errors.description_en === 'string' && (
              <FormErrorMessage whiteSpace={'pre-wrap'}>
                {errors.description_en}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            id="description_fr"
            isInvalid={typeof errors.description_fr === 'string'}
          >
            <FormLabel>
              <Trans>Description (French)</Trans>
            </FormLabel>
            <Input {...register('description_fr')} />
            {typeof errors.description_fr === 'string' && (
              <FormErrorMessage whiteSpace={'pre-wrap'}>
                {errors.description_fr}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            id="data_type"
            isInvalid={typeof errors.data_type === 'string'}
          >
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
            {typeof errors.data_type === 'string' && (
              <FormErrorMessage whiteSpace={'pre-wrap'}>
                {errors.data_type}
              </FormErrorMessage>
            )}
          </FormControl>
          <HStack spacing={4}>
            <Button
              loadingText={t`Updating column`}
              isLoading={updateLoading}
              isDisabled={_.some(
                errors,
                (error) => typeof error !== 'undefined',
              )}
              type="submit"
              colorScheme="blue"
              size="lg"
            >
              <Trans>Submit</Trans>
            </Button>
          </HStack>
          {updateError && <GraphQLErrorDisplay error={updateError} />}
          {validationError && <GraphQLErrorDisplay error={validationError} />}
        </Stack>
      </form>
    </Container>
  );
};

export default ColumnManagementForm;
