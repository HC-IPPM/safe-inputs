import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  IconButton,
  Textarea,
  VStack,
  HStack,
  useToast,
} from '@chakra-ui/react';

import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import debounce from 'debounce-promise';

import _ from 'lodash';

import { useEffect } from 'react';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import {
  useCollectionCreation,
  useCollectionUpdate,
  useLazyCollectionDefInputValidation,
} from 'src/graphql/index.ts';
import type { CollectionDefInput } from 'src/graphql/schema_common.d.ts';

import { GraphQLErrorDisplay } from './GraphQLErrorDisplay.tsx';

interface CollectionFormProps {
  collection_id?: string;
  initial_collection_state?: CollectionDefInput;
}

// useFieldArray needs object values, have to wrap our string arrays in to a collection,
// and then unwrap them afterwards
type CollectionDefFields = Omit<
  CollectionDefInput,
  'owner_emails' | 'uploader_emails'
> & {
  owner_emails: { email: string }[];
  uploader_emails: { email: string }[];
};
const collection_def_input_to_fields = (
  input: CollectionDefInput,
): CollectionDefFields => ({
  ...input,
  owner_emails: _.map(input.owner_emails, (email) => ({ email })),
  uploader_emails: _.map(input.uploader_emails, (email) => ({ email })),
});
const collection_def_fields_to_input = (
  fields: CollectionDefFields,
): CollectionDefInput => ({
  ...fields,
  owner_emails: _.map(fields.owner_emails, 'email'),
  uploader_emails: _.map(fields.uploader_emails, 'email'),
});

export function CollectionManagementForm({
  collection_id,
  initial_collection_state,
}: CollectionFormProps) {
  const is_creation = typeof collection_id === 'undefined';

  const toast = useToast();

  const navigate = useNavigate();

  const {
    i18n: { locale },
  } = useLingui();

  const [createCollection, { loading: creationLoading, error: creationError }] =
    useCollectionCreation();
  const [updateCollection, { loading: updateLoading, error: updateError }] =
    useCollectionUpdate();

  const mutationLoading = is_creation ? creationLoading : updateLoading;
  const mutationError = is_creation ? creationError : updateError;

  // Errors during collection updation are captured by the error state of the mutation
  const onSubmit = async (form_data: CollectionDefFields) => {
    const result = await (async () => {
      if (is_creation) {
        return createCollection({
          variables: {
            collection_def: collection_def_fields_to_input(form_data),
          },
        });
      } else {
        return updateCollection({
          variables: {
            collection_id,
            collection_def: collection_def_fields_to_input(form_data),
          },
        });
      }
    })();

    if (result.data) {
      const { id } =
        'create_collection' in result.data
          ? result.data.create_collection
          : result.data.update_collection;
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
      navigate(`/manage-collection/${id}`, {
        state: {
          redirect: true,
        },
      });
    }
  };

  const [
    lazyCoollectionDefInputValidation,
    { loading: validationLoading, error: validationError },
  ] = useLazyCollectionDefInputValidation();
  const debounced_form_validation = debounce(
    async (form_data: CollectionDefFields) => {
      const result = await lazyCoollectionDefInputValidation({
        variables: collection_def_fields_to_input(form_data),
      });

      if (typeof result.data === 'undefined') {
        throw new Error('TODO');
      }

      const {
        owner_emails,
        uploader_emails,
        ...flat_field_validation_results
      } = result.data.validate_collection_def;

      const flat_field_validation_messages = _.chain(
        flat_field_validation_results,
      )
        .omitBy(
          (validation_result, key) =>
            key === '__typename' || _.isNull(validation_result),
        )
        .mapValues((validation_result) => _.get(validation_result, locale))
        .value();

      const array_field_validation_messages = _.chain({
        owner_emails,
        uploader_emails,
      })
        .omitBy(
          (validation_results) =>
            _.isEmpty(validation_results) ||
            _.every(validation_results, _.isNull),
        )
        .mapValues((validation_results) =>
          _.map(validation_results, (validation_result) => ({
            email: _.get(validation_result, locale),
          })),
        )
        .value();

      const error_messages_in_current_locale = {
        ...flat_field_validation_messages,
        ...array_field_validation_messages,
      };

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
    control,
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<CollectionDefFields>({
    defaultValues:
      typeof initial_collection_state === 'undefined'
        ? {
            name_en: '',
            name_fr: '',
            description_en: '',
            description_fr: '',
            owner_emails: [],
            uploader_emails: [],
            is_locked: true,
          }
        : collection_def_input_to_fields(initial_collection_state),
    resolver: debounced_form_validation,
    mode: 'onChange',
  });

  const {
    fields: owner_fields,
    append: append_owner,
    remove: remove_owner,
  } = useFieldArray({
    control,
    name: 'owner_emails',
  });

  const {
    fields: uploader_fields,
    append: append_uploader,
    remove: remove_uploader,
  } = useFieldArray({
    control,
    name: 'uploader_emails',
  });

  const is_valid = !_.some(errors, (error) => typeof error !== 'undefined');

  // validate on initial render to get initial errors, e.g. mark required fields
  useEffect(() => {
    trigger();
  }, [trigger]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
      <VStack spacing={4} align="flex-start">
        {!is_creation && (
          <FormControl isInvalid={typeof errors.is_locked === 'string'}>
            <Checkbox {...register('is_locked')}>
              <Trans>Locked</Trans>
            </Checkbox>
            {typeof errors.is_locked === 'string' && (
              <FormErrorMessage whiteSpace={'pre-wrap'}>
                {errors.is_locked}
              </FormErrorMessage>
            )}
          </FormControl>
        )}

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

        <FormControl as="fieldset" maxWidth={600}>
          <FormLabel as="legend">
            <Trans>Collection Owner Emails</Trans>
          </FormLabel>
          {owner_fields.map((field, index) => (
            <FormControl
              key={field.id}
              paddingLeft={8}
              marginBottom={2}
              isInvalid={
                errors.owner_emails &&
                errors.owner_emails[index] &&
                typeof errors.owner_emails[index]?.email === 'string'
              }
            >
              <FormLabel>
                <Trans>Owner Email</Trans>
              </FormLabel>
              <HStack>
                <Controller
                  control={control}
                  name={`owner_emails.${index}.email`}
                  render={({ field }) => (
                    <Input
                      type="email"
                      {...field}
                      placeholder={t`Enter email`}
                      value={field.value || ''}
                    />
                  )}
                />
                <IconButton
                  aria-label={t`Remove ${field.email}`}
                  title={t`Remove ${field.email}`}
                  icon={<DeleteIcon />}
                  onClick={() => remove_owner(index)}
                  size={'sm'}
                />
              </HStack>
              {errors.owner_emails &&
                errors.owner_emails[index] &&
                typeof errors.owner_emails[index]?.email === 'string' && (
                  <FormErrorMessage whiteSpace={'pre-wrap'}>
                    {errors.owner_emails[index].email}
                  </FormErrorMessage>
                )}
            </FormControl>
          ))}
          <IconButton
            aria-label={t`Add an owner email`}
            title={t`Add an owner email`}
            icon={<AddIcon />}
            onClick={() => append_owner({ email: '' })}
            size={'sm'}
            marginLeft={8}
          />
        </FormControl>

        <FormControl as="fieldset" maxWidth={600}>
          <FormLabel as="legend">
            <Trans>Collection Uploader Emails</Trans>
          </FormLabel>
          {uploader_fields.map((field, index) => (
            <FormControl
              key={field.id}
              paddingLeft={8}
              marginBottom={2}
              isInvalid={
                errors.uploader_emails &&
                errors.uploader_emails[index] &&
                typeof errors.uploader_emails[index]?.email === 'string'
              }
            >
              <FormLabel>
                <Trans>Uploader Email</Trans>
              </FormLabel>
              <HStack>
                <Controller
                  control={control}
                  name={`uploader_emails.${index}.email`}
                  render={({ field }) => (
                    <Input
                      type="email"
                      {...field}
                      placeholder={t`Enter email`}
                      value={field.value || ''}
                    />
                  )}
                />
                <IconButton
                  aria-label={t`Remove ${field.email}`}
                  title={t`Remove ${field.email}`}
                  icon={<DeleteIcon />}
                  onClick={() => remove_uploader(index)}
                  size={'sm'}
                />
              </HStack>
              {errors.uploader_emails &&
                errors.uploader_emails[index] &&
                typeof errors.uploader_emails[index]?.email === 'string' && (
                  <FormErrorMessage whiteSpace={'pre-wrap'}>
                    {errors.uploader_emails[index].email}
                  </FormErrorMessage>
                )}
            </FormControl>
          ))}
          <IconButton
            aria-label={t`Add an uploader email`}
            title={t`Add an uploader email`}
            icon={<AddIcon />}
            onClick={() => append_uploader({ email: '' })}
            size={'sm'}
            marginLeft={8}
          />
        </FormControl>

        <Button
          isLoading={mutationLoading || validationLoading}
          loadingText={
            updateLoading
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
}
