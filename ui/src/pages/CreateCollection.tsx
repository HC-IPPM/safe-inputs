import { gql, useMutation } from '@apollo/client';

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

import type { FieldProps } from 'formik';
import { Formik, Form, Field, FieldArray } from 'formik';

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
  ) {
    create_collection_init(
      collection_def: {
        name_en: $name_en
        name_fr: $name_fr
        description_en: $description_en
        description_fr: $description_fr
        owner_emails: $owner_emails
        uploader_emails: $uploader_emails
        is_locked: true
      }
    ) {
      id
    }
  }
`;

// TODO at some point, I'll integrate a tool to generate types from queries
type CollectionDefInput = {
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  owner_emails: string[];
  uploader_emails: string[];
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

  const [
    createCollectionInit,
    { data, loading: creationLoading, error: creationError },
  ] = useMutation<
    { create_collection_init: { id: string } },
    CollectionDefInput
  >(CREATE_COLLECTION_INIT);

  if (session !== null && !session.can_own_collections) {
    navigate('/');
  } else if (data?.create_collection_init.id) {
    navigate(`/manage-collection/${data?.create_collection_init.id}`);
  } else if (creationError) {
    // Form validation to be handled within Formik, so an error at this point is something unexpected
    // TODO: likely still want to catch and display this at the top of the route so that the user's progress isn't lost
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
          } as CollectionDefInput
        }
        validate={async (collection_def) => {
          // TODO get validation via API call
          return {};
        }}
        onSubmit={(collection_def) =>
          createCollectionInit({
            variables: collection_def,
          })
        }
      >
        {({ isSubmitting, values, touched, errors }) => (
          <Form>
            <VStack spacing={4} align="flex-start">
              <Field name="name_en">
                {({ field, meta }: FieldProps<string>) => (
                  <FormControl
                    isInvalid={
                      meta.touched && typeof meta.error !== 'undefined'
                    }
                  >
                    <FormLabel>Name (English)</FormLabel>
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
                    <FormLabel>Name (French)</FormLabel>
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
                    <FormLabel>Description (Enligh)</FormLabel>
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
                    <FormLabel>Description (French)</FormLabel>
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
                              <FormLabel>Email</FormLabel>
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
                              <FormLabel>Email</FormLabel>
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
              <Button type="submit" isLoading={isSubmitting}>
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
