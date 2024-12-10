import { Trans } from '@lingui/react/macro';
import { t } from '@lingui/core/macro';
import {
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react';

import { useLingui } from '@lingui/react';

import debounce from 'debounce-promise';

import _ from 'lodash';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import {
  CollectionWithColumnDetailsQuery,
  ColumnDefInput,
} from 'src/graphql/__generated__/graphql.ts';
import {
  useColumnDefCreation,
  useColumnDefUpdate,
  useLazyColumnDefInputValidation,
} from 'src/graphql/index.ts';

import { GraphQLErrorDisplay } from './GraphQLErrorDisplay.tsx';

interface ColumnManagementFormProps {
  collectionId: string;
  columnId?: string;
  initialColumnState?: CollectionWithColumnDetailsQuery['collection']['column_defs'][number];
}

export const ColumnManagementForm = function ({
  collectionId,
  columnId,
  initialColumnState,
}: ColumnManagementFormProps) {
  const is_new_column = typeof columnId === 'undefined';

  const toast = useToast();

  const navigate = useNavigate();

  const {
    i18n: { locale },
  } = useLingui();

  const [createColumnDefs, { loading: creationLoading, error: creationError }] =
    useColumnDefCreation();

  const [updateColumnDefs, { loading: updateLoading, error: updateError }] =
    useColumnDefUpdate();

  const mutationLoading = is_new_column ? creationLoading : updateLoading;
  const mutationError = is_new_column ? creationError : updateError;

  // Errors during column def updates are captured by the error state of the mutation
  const onSubmit = async (formData: ColumnDefInput) => {
    const id = await (async () => {
      if (is_new_column) {
        const response = await createColumnDefs({
          variables: {
            collection_id: collectionId,
            column_def: formData,
          },
        });

        return response?.data?.create_column_def?.id;
      } else {
        const response = await updateColumnDefs({
          variables: {
            collection_id: collectionId,
            column_id: columnId,
            column_def: formData,
          },
        });

        return response?.data?.update_column_def?.id;
      }
    })();

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
  };

  const [
    lazyColumnDefInputValidation,
    { loading: validationLoading, error: validationError },
  ] = useLazyColumnDefInputValidation();
  const debounced_form_validation = debounce(
    async (form_data: ColumnDefInput) => {
      const result = await lazyColumnDefInputValidation({
        variables: {
          collection_id: collectionId,
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
      typeof initialColumnState === 'undefined'
        ? {
            header: '',
            name_en: '',
            name_fr: '',
            description_en: '',
            description_fr: '',
            data_type: '',
            conditions: [],
          }
        : _.omit(initialColumnState, '__typename', 'id'),
    resolver: debounced_form_validation,
    mode: 'onChange',
  });

  const is_valid = !_.some(errors, (error) => typeof error !== 'undefined');

  // validate on initial render to get initial errors, e.g. mark required fields
  useEffect(() => {
    trigger();
  }, [trigger]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4}>
        <FormControl
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

        <FormControl isInvalid={typeof errors.name_en === 'string'}>
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

        <FormControl isInvalid={typeof errors.name_fr === 'string'}>
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

        <FormControl isInvalid={typeof errors.description_en === 'string'}>
          <FormLabel>
            <Trans>Description (English)</Trans>
          </FormLabel>
          <Textarea {...register('description_en')} />
          {typeof errors.description_en === 'string' && (
            <FormErrorMessage whiteSpace={'pre-wrap'}>
              {errors.description_en}
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={typeof errors.description_fr === 'string'}>
          <FormLabel>
            <Trans>Description (French)</Trans>
          </FormLabel>
          <Textarea {...register('description_fr')} />
          {typeof errors.description_fr === 'string' && (
            <FormErrorMessage whiteSpace={'pre-wrap'}>
              {errors.description_fr}
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={typeof errors.data_type === 'string'}>
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

        <Button
          isLoading={mutationLoading || validationLoading}
          loadingText={
            mutationLoading
              ? t`Form is submitting, please wait`
              : validationLoading
                ? t`Form is validating, please wait`
                : undefined
          }
          isDisabled={!is_valid}
          type="submit"
          size="lg"
        >
          {!is_valid ? t`Form contains validation errors` : t`Submit`}
        </Button>
        {mutationError && <GraphQLErrorDisplay error={mutationError} />}
        {validationError && <GraphQLErrorDisplay error={validationError} />}
      </VStack>
    </form>
  );
};
