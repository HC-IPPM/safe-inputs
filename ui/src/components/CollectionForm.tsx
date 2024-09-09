import { gql, useMutation } from '@apollo/client';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Trans } from '@lingui/macro';
import _ from 'lodash';

import {
  useForm,
  useFieldArray,
  Controller,
  FieldArrayWithId,
  Control,
} from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import type { Collection, User } from 'src/schema/utils.ts';

import GraphQLErrorDisplay from './GraphQLErrorDisplay.tsx';
const UPDATE_COLLECTION = gql`
  mutation CollectionUpdate(
    $collection_id: String!
    $collection_updates: CollectionDefInput!
  ) {
    update_collection(
      collection_id: $collection_id
      collection_updates: $collection_updates
    ) {
      id
    }
  }
`;

function renderEmailFields({
  title,
  emailFields,
  control,
  fieldName,
  appendEmail,
  removeEmail,
}: {
  title: React.ReactNode;
  emailFields: FieldArrayWithId[];
  control: Control<Collection>;
  fieldName: string;
  appendEmail: (email: { email: string }) => void;
  removeEmail: (index: number) => void;
}) {
  return (
    <Box>
      <FormLabel fontWeight="bold">{title}</FormLabel>
      {emailFields.map((item, index) => (
        <HStack key={item.id} spacing={4} mb={2}>
          <Controller
            control={control}
            name={`${fieldName}.${index}.email`}
            render={({ field }) => (
              <Input
                type="email"
                placeholder="Enter email"
                {...field}
                isRequired
              />
            )}
          />
          <Button colorScheme="red" onClick={() => removeEmail(index)}>
            <Trans>Remove</Trans>
          </Button>
        </HStack>
      ))}
      <Button colorScheme="blue" onClick={() => appendEmail({ email: '' })}>
        <Trans>Add Email</Trans>
      </Button>
    </Box>
  );
}

interface CollectionFormProps {
  data: Collection;
}

function CollectionForm({ data }: CollectionFormProps) {
  const { register, handleSubmit, control } = useForm<Collection>({
    defaultValues: data,
  });

  const {
    fields: ownerEmailFields,
    append: appendOwnerEmail,
    remove: removeOwnerEmail,
  } = useFieldArray({
    control,
    name: 'owners',
  });

  const {
    fields: uploaderEmailFields,
    append: appendUploaderEmail,
    remove: removeUploaderEmail,
  } = useFieldArray({
    control,
    name: 'uploaders',
  });

  const [updateCollection, { loading, error }] = useMutation(UPDATE_COLLECTION);
  const navigate = useNavigate();
  const toast = useToast();

  const onSubmit = async (formData: Collection) => {
    try {
      const result = await updateCollection({
        variables: {
          collection_id: formData.id,
          collection_updates: {
            ..._.pick(formData, [
              'name_en',
              'name_fr',
              'description_en',
              'description_fr',
              'is_locked',
            ]),
            owner_emails: formData.owners.map((owner: User) => owner.email),
            uploader_emails: formData.uploaders.map(
              (uploader: User) => uploader.email,
            ),
          },
        },
      });
      if (result.data) {
        const { id } = result.data.update_collection;
        if (!id) {
          throw Error('Missing ID for updated collection');
        }
        toast({
          title: <Trans>Collection Updated</Trans>,
          description: <Trans>Collection Updated successfully</Trans>,
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
    } catch (e) {
      console.error('Error updating collection:', e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4} align="start">
        {error && <GraphQLErrorDisplay error={error} />}
        {loading && <Text>Loading...</Text>}

        <FormControl display="flex" alignItems="center">
          <Checkbox {...register('is_locked')}>Locked?</Checkbox>
        </FormControl>

        <FormControl id="name-en" isRequired>
          <FormLabel>Name</FormLabel>
          <Input type="text" {...register('name_en')} />
        </FormControl>

        <FormControl id="name-fr" isRequired>
          <FormLabel>Nom</FormLabel>
          <Input type="text" {...register('name_fr')} />
        </FormControl>

        <FormControl id="description-en" isRequired>
          <FormLabel>Description (English)</FormLabel>
          <Textarea {...register('description_en')} />
        </FormControl>

        <FormControl id="description-fr" isRequired>
          <FormLabel>Description (French)</FormLabel>
          <Textarea {...register('description_fr')} />
        </FormControl>

        {renderEmailFields({
          title: <Trans>Owner Emails</Trans>,
          emailFields: ownerEmailFields,
          control,
          fieldName: 'owners',
          appendEmail: appendOwnerEmail,
          removeEmail: removeOwnerEmail,
        })}

        {renderEmailFields({
          title: <Trans>Uploader Emails</Trans>,
          emailFields: uploaderEmailFields,
          control,
          fieldName: 'uploaders',
          appendEmail: appendUploaderEmail,
          removeEmail: removeUploaderEmail,
        })}

        <Button type="submit" colorScheme="teal" isLoading={loading}>
          <Trans>Update Collection Details</Trans>
        </Button>
      </VStack>
    </form>
  );
}

export default CollectionForm;
