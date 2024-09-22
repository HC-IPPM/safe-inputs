import { useMutation, useApolloClient } from '@apollo/client';

import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Button,
  Input,
  Textarea,
  FormErrorMessage,
  VStack,
  HStack,
  IconButton,
} from '@chakra-ui/react';

import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import debounce from 'debounce-promise';
import type { FieldProps } from 'formik';
import { Formik, Form, Field, FieldArray } from 'formik';
import _ from 'lodash';

import { memo } from 'react';

import { useNavigate } from 'react-router-dom';

import type { Session } from 'src/components/auth/auth_utils.ts';
import { useSession } from 'src/components/auth/session.tsx';
import { LoadingBlock } from 'src/components/Loading.tsx';
import {
  CREATE_COLLECTION,
  COLLECTION_DEF_INPUT_VALIDATION,
} from 'src/graphql/index.ts';

import type {
  CreateCollectionInit,
  CollectionDefInput,
  CollectionDefValidation,
} from 'src/graphql/schema.d.ts';

// memoizing on session so that the session sync on browser focus won't trigger rerenders
// TODO: most routes will deal with this, bake it in to some sort of route level component
// (along with other things to standardize like headers and container layouts)
const CreateCollectionContent = memo(function CreateCollectionContent({
  session,
}: {
  session: Session;
}) {
  const navigate = useNavigate();
  const {
    i18n: { locale },
  } = useLingui();

  const client = useApolloClient();

  const [createCollectionInit, { data, error: creationError }] = useMutation<
    CreateCollectionInit,
    CollectionDefInput
  >(CREATE_COLLECTION);

  const id_of_created_collection = data?.create_collection_init.id;

  if (session !== null && !session.can_own_collections) {
    navigate('/');
  } else if (id_of_created_collection) {
    navigate(`/manage-collection/${id_of_created_collection}`);
  } else if (creationError) {
    // Form validation to be handled within Formik, so an error at this point is something unexpected, like a network issue
    // TODO: likely still want to catch and display these at the top of the route without throwing out the user's form progress
    throw creationError;
  } else {
    const debounced_validation_query = debounce(
      async (collection_def: CollectionDefInput) => {
        const {
          data: { validate_collection_def },
        } = await client.query<CollectionDefValidation, CollectionDefInput>({
          query: COLLECTION_DEF_INPUT_VALIDATION,
          variables: collection_def,
        });

        const {
          owner_emails,
          uploader_emails,
          ...flat_field_validation_results
        } = validate_collection_def;

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
            _.map(validation_results, (validation_result) =>
              _.get(validation_result, locale),
            ),
          )
          .value();

        return {
          ...flat_field_validation_messages,
          ...array_field_validation_messages,
        };
      },
      250,
    );

    return (
      <Formik
        initialValues={
          {
            name_en: '',
            name_fr: '',
            description_en: '',
            description_fr: '',
            owner_emails: [],
            uploader_emails: [],
            is_locked: true,
          } as CollectionDefInput
        }
        validate={debounced_validation_query}
        validateOnMount={true}
        onSubmit={(collection_def) =>
          createCollectionInit({
            variables: collection_def,
          })
        }
      >
        {({ values, errors, isValid, isValidating, isSubmitting }) => (
          <Form style={{ width: '100%' }}>
            <VStack spacing={4} align="flex-start">
              <Field name="name_en">
                {({ field, meta }: FieldProps<string>) => (
                  <FormControl isInvalid={typeof meta.error !== 'undefined'}>
                    <FormLabel>
                      <Trans>Name (English)</Trans>
                    </FormLabel>
                    <Input {...field} />
                    {meta.error && (
                      <FormErrorMessage whiteSpace={'pre-wrap'}>
                        {meta.error}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                )}
              </Field>
              <Field name="name_fr">
                {({ field, meta }: FieldProps<string>) => (
                  <FormControl isInvalid={typeof meta.error !== 'undefined'}>
                    <FormLabel>
                      <Trans>Name (French)</Trans>
                    </FormLabel>
                    <Input {...field} />
                    {meta.error && (
                      <FormErrorMessage whiteSpace={'pre-wrap'}>
                        {meta.error}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                )}
              </Field>
              <Field name="description_en">
                {({ field, meta }: FieldProps<string>) => (
                  <FormControl isInvalid={typeof meta.error !== 'undefined'}>
                    <FormLabel>
                      <Trans>Description (English)</Trans>
                    </FormLabel>
                    <Textarea {...field} />
                    {meta.error && (
                      <FormErrorMessage whiteSpace={'pre-wrap'}>
                        {meta.error}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                )}
              </Field>
              <Field name="description_fr">
                {({ field, meta }: FieldProps<string>) => (
                  <FormControl isInvalid={typeof meta.error !== 'undefined'}>
                    <FormLabel>
                      <Trans>Description (French)</Trans>
                    </FormLabel>
                    <Textarea {...field} />
                    {meta.error && (
                      <FormErrorMessage whiteSpace={'pre-wrap'}>
                        {meta.error}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                )}
              </Field>
              <FieldArray
                name="owner_emails"
                render={({ form, name, ...arrayHelpers }) => (
                  <FormControl as="fieldset" maxWidth={600}>
                    <FormLabel as="legend">
                      <Trans>Collection Owner Emails</Trans>
                    </FormLabel>
                    {values.owner_emails.map((email, index) => (
                      <Field key={index} name={`owner_emails.${index}`}>
                        {({ field }: FieldProps<string>) => (
                          <FormControl
                            paddingLeft={8}
                            marginBottom={2}
                            isInvalid={
                              typeof _.get(errors.owner_emails, index) !==
                              'undefined'
                            }
                          >
                            <FormLabel>
                              <Trans>Owner Email</Trans>
                            </FormLabel>
                            <HStack>
                              <Input {...field} />
                              <IconButton
                                aria-label={t`Remove ${email}`}
                                title={t`Remove ${email}`}
                                icon={<DeleteIcon />}
                                onClick={() => arrayHelpers.remove(index)}
                                size={'sm'}
                              />
                            </HStack>
                            {errors.owner_emails &&
                              errors.owner_emails[index] && (
                                <FormErrorMessage whiteSpace={'pre-wrap'}>
                                  {errors.owner_emails[index]}
                                </FormErrorMessage>
                              )}
                          </FormControl>
                        )}
                      </Field>
                    ))}
                    <IconButton
                      aria-label={t`Add an owner email`}
                      title={t`Add an owner email`}
                      icon={<AddIcon />}
                      onClick={() => arrayHelpers.push('')}
                      size={'sm'}
                      marginLeft={8}
                    />
                  </FormControl>
                )}
              />
              <FieldArray
                name="uploader_emails"
                render={({ form, name, ...arrayHelpers }) => (
                  <FormControl as="fieldset" maxWidth={600}>
                    <FormLabel as="legend">
                      <Trans>Collection Uploader Emails</Trans>
                    </FormLabel>
                    {values.uploader_emails.map((email, index) => (
                      <Field key={index} name={`uploader_emails.${index}`}>
                        {({ field }: FieldProps<string>) => (
                          <FormControl
                            paddingLeft={8}
                            marginBottom={2}
                            isInvalid={
                              typeof _.get(errors.uploader_emails, index) !==
                              'undefined'
                            }
                          >
                            <FormLabel>
                              <Trans>Uploader Email</Trans>
                            </FormLabel>
                            <HStack>
                              <Input {...field} />
                              <IconButton
                                aria-label={t`Remove ${email}`}
                                title={t`Remove ${email}`}
                                icon={<DeleteIcon />}
                                onClick={() => arrayHelpers.remove(index)}
                                size={'sm'}
                              />
                            </HStack>
                            {errors.uploader_emails &&
                              errors.uploader_emails[index] && (
                                <FormErrorMessage whiteSpace={'pre-wrap'}>
                                  {errors.uploader_emails[index]}
                                </FormErrorMessage>
                              )}
                          </FormControl>
                        )}
                      </Field>
                    ))}
                    <IconButton
                      aria-label={t`Add an owner email`}
                      title={t`Add an owner email`}
                      icon={<AddIcon />}
                      onClick={() => arrayHelpers.push('')}
                      size={'sm'}
                      marginLeft={8}
                    />
                  </FormControl>
                )}
              />
              <Button
                type="submit"
                isLoading={isSubmitting || isValidating}
                loadingText={
                  isSubmitting
                    ? t`Form is submitting, please wait`
                    : isValidating
                      ? t`Form is validating, please wait`
                      : undefined
                }
                isDisabled={!isValid}
              >
                {!isValid ? t`Form contains validation errors` : t`Submit`}
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    );
  }
});

export default function CreateCollection() {
  const { status, session } = useSession({ allow_unauthenticated: false });

  const has_session = session !== null;

  // TODO: bad page boilerplate, staying consistent with other pages for now but I've opened issues to clean them all up
  return (
    <>
      <Box className="App-header" mb={2}>
        <h1>
          <Trans>Create Collection</Trans>
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
          {has_session && <CreateCollectionContent session={session} />}
        </LoadingBlock>
      </Container>
    </>
  );
}
