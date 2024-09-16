import { gql, useMutation, useApolloClient } from '@apollo/client';

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

import type { FieldProps } from 'formik';
import { Formik, Form, Field, FieldArray } from 'formik';
import _ from 'lodash';

import { memo } from 'react';

import { useNavigate } from 'react-router-dom';

import type { Session } from 'src/components/auth/auth_utils.ts';
import { useSession } from 'src/components/auth/session.tsx';
import { LoadingBlock } from 'src/components/Loading.tsx';

const CREATE_COLLECTION_INIT = gql`
  mutation CreateCollectionInit(
    $name_en: String!
    $name_fr: String!
    $description_en: String!
    $description_fr: String!
    $owner_emails: [String!]!
    $uploader_emails: [String!]!
    $is_locked: Boolean!
  ) {
    create_collection_init(
      collection_def: {
        name_en: $name_en
        name_fr: $name_fr
        description_en: $description_en
        description_fr: $description_fr
        owner_emails: $owner_emails
        uploader_emails: $uploader_emails
        is_locked: $is_locked
      }
    ) {
      id
    }
  }
`;
type CreateCollectionInitResult = { create_collection_init: { id: string } };

const VALIDATE_COLLECTION_DEF = gql`
  query ValidateCollectionDef(
    $name_en: String!
    $name_fr: String!
    $description_en: String!
    $description_fr: String!
    $owner_emails: [String!]!
    $uploader_emails: [String!]!
    $is_locked: Boolean!
  ) {
    validate_collection_def(
      collection_def: {
        name_en: $name_en
        name_fr: $name_fr
        description_en: $description_en
        description_fr: $description_fr
        owner_emails: $owner_emails
        uploader_emails: $uploader_emails
        is_locked: $is_locked
      }
    ) {
      name_en {
        en
        fr
      }
      name_fr {
        en
        fr
      }
      description_en {
        en
        fr
      }
      description_fr {
        en
        fr
      }
      is_locked {
        en
        fr
      }
      owner_emails {
        en
        fr
      }
      uploader_emails {
        en
        fr
      }
    }
  }
`;
type ValidateCollectionDefResult = {
  validate_collection_def: {
    name_en: ValidationResult;
    name_fr: ValidationResult;
    description_en: ValidationResult;
    description_fr: ValidationResult;
    is_locked: ValidationResult;
    owner_emails: ValidationResult;
    uploader_emails: ValidationResult;
  };
};
type ValidationResult = {
  en: string;
  fr: string;
};

// TODO at some point, I'll integrate a tool to generate types from queries
type CollectionDefInput = {
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  owner_emails: string[];
  uploader_emails: string[];
  is_locked: boolean;
};

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

  const [
    createCollectionInit,
    { data, loading: creationLoading, error: creationError },
  ] = useMutation<CreateCollectionInitResult, CollectionDefInput>(
    CREATE_COLLECTION_INIT,
  );

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
        validate={async (collection_def) => {
          const {
            data: { validate_collection_def },
          } = await client.query<
            ValidateCollectionDefResult,
            CollectionDefInput
          >({
            query: VALIDATE_COLLECTION_DEF,
            variables: collection_def,
          });

          return _.mapValues(validate_collection_def, (validation_result) =>
            _.get(validation_result, locale, null),
          );
        }}
        validateOnChange={false}
        validateOnBlur={true}
        onSubmit={(collection_def) =>
          createCollectionInit({
            variables: collection_def,
          })
        }
      >
        {({ values, touched, errors, isValid, isSubmitting }) => (
          <Form>
            <VStack spacing={4} align="flex-start">
              <Field name="name_en">
                {({ field, meta }: FieldProps<string>) => (
                  <FormControl
                    isInvalid={
                      meta.touched && typeof meta.error !== 'undefined'
                    }
                  >
                    <FormLabel>
                      <Trans>Name (English)</Trans>
                    </FormLabel>
                    <Input {...field} />
                    {meta.touched && meta.error && (
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              </Field>
              <Field name="name_fr">
                {({ field, meta }: FieldProps<string>) => (
                  <FormControl
                    isInvalid={
                      meta.touched && typeof meta.error !== 'undefined'
                    }
                  >
                    <FormLabel>
                      <Trans>Name (French)</Trans>
                    </FormLabel>
                    <Input {...field} />
                    {meta.touched && meta.error && (
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              </Field>
              <Field name="description_en">
                {({ field, meta }: FieldProps<string>) => (
                  <FormControl
                    isInvalid={
                      meta.touched && typeof meta.error !== 'undefined'
                    }
                  >
                    <FormLabel>
                      <Trans>Description (English)</Trans>
                    </FormLabel>
                    <Textarea {...field} />
                    {meta.touched && meta.error && (
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              </Field>
              <Field name="description_fr">
                {({ field, meta }: FieldProps<string>) => (
                  <FormControl
                    isInvalid={
                      meta.touched && typeof meta.error !== 'undefined'
                    }
                  >
                    <FormLabel>
                      <Trans>Description (French)</Trans>
                    </FormLabel>
                    <Textarea {...field} />
                    {meta.touched && meta.error && (
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              </Field>
              <FieldArray
                name="owner_emails"
                render={({ form, name, ...arrayHelpers }) => (
                  <FormControl as="fieldset">
                    <FormLabel as="legend">
                      <Trans>Collection Owner Emails</Trans>
                    </FormLabel>
                    {values.owner_emails.map((email, index) => (
                      <Field key={index} name={`owner_emails.${index}`}>
                        {({ field }: FieldProps<string>) => (
                          <FormControl marginLeft={4}>
                            <HStack marginBottom={2}>
                              <FormLabel>
                                <Trans>Email</Trans>
                              </FormLabel>
                              <Input {...field} />
                              <IconButton
                                aria-label={t`Remove ${email}`}
                                title={t`Remove ${email}`}
                                icon={<DeleteIcon />}
                                onClick={() => arrayHelpers.remove(index)}
                                size={'sm'}
                              />
                            </HStack>
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
                    {touched.owner_emails && errors.owner_emails && (
                      <FormErrorMessage>{errors.owner_emails}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              />
              <FieldArray
                name="uploader_emails"
                render={({ form, name, ...arrayHelpers }) => (
                  <FormControl as="fieldset">
                    <FormLabel as="legend">
                      <Trans>Collection Uploader Emails</Trans>
                    </FormLabel>
                    {values.uploader_emails.map((email, index) => (
                      <Field key={index} name={`uploader_emails.${index}`}>
                        {({ field }: FieldProps<string>) => (
                          <FormControl marginLeft={4}>
                            <HStack marginBottom={2}>
                              <FormLabel>
                                <Trans>Email</Trans>
                              </FormLabel>
                              <Input {...field} />
                              <IconButton
                                aria-label={t`Remove ${email}`}
                                title={t`Remove ${email}`}
                                icon={<DeleteIcon />}
                                onClick={() => arrayHelpers.remove(index)}
                                size={'sm'}
                              />
                            </HStack>
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
                    {touched.uploader_emails && errors.uploader_emails && (
                      <FormErrorMessage>
                        {errors.uploader_emails}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                )}
              />
              <Button type="submit" isLoading={isSubmitting} disabled={isValid}>
                <Trans>Submit</Trans>
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
