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
} from '@chakra-ui/react';
import { Trans } from '@lingui/macro';
import _ from 'lodash';
import { useState } from 'react';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import type { Collection, User } from 'src/schema/utils.ts';

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

interface CollectionFormProps {
  data: Collection;
  redirect: boolean;
}
function CollectionForm({ data, redirect }: CollectionFormProps) {
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
  const [success, setSuccess] = useState<boolean>(redirect);

  const onSubmit = async (formData: Collection) => {
    console.log(formData);
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
        navigate(`/manage-collection/${id}`, {
          state: {
            redirect: true,
          },
        });
      }
    } catch (e) {
      setSuccess(false);
      console.error('Error updating collection:', e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4} align="start">
        {error && (
          <Box
            borderWidth={1}
            borderColor="red.500"
            borderRadius="md"
            p={4}
            bg="red.50"
            color="red.700"
            mb={4}
          >
            <Text fontWeight="bold">Error:</Text>
            <Text>{JSON.stringify(error, null, 2)}</Text>
          </Box>
        )}
        {success && (
          <Box
            borderWidth={1}
            borderColor="green.500"
            borderRadius="md"
            p={4}
            bg="green.50"
            color="green.700"
          >
            <Text>
              <Trans>Collection updated successfully</Trans>
            </Text>
          </Box>
        )}
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

        <Box>
          <FormLabel fontWeight="bold">Owner Emails</FormLabel>
          {ownerEmailFields.map((item, index) => (
            <HStack key={item.id} spacing={4} mb={2}>
              <Controller
                control={control}
                name={`owners.${index}.email`}
                render={({ field }) => (
                  <Input
                    type="email"
                    placeholder="Enter owner email"
                    {...field}
                  />
                )}
              />
              <Button colorScheme="red" onClick={() => removeOwnerEmail(index)}>
                Remove
              </Button>
            </HStack>
          ))}
          <Button
            colorScheme="blue"
            onClick={() => appendOwnerEmail({ email: '' })}
          >
            Add Owner Email
          </Button>
        </Box>

        <Box>
          <FormLabel fontWeight="bold">Uploader Emails</FormLabel>
          {uploaderEmailFields.map((item, index) => (
            <HStack key={item.id} spacing={4} mb={2}>
              <Controller
                control={control}
                name={`uploaders.${index}.email`}
                render={({ field }) => (
                  <Input
                    type="email"
                    placeholder="Enter uploader email"
                    {...field}
                  />
                )}
              />
              <Button
                colorScheme="red"
                onClick={() => removeUploaderEmail(index)}
              >
                Remove
              </Button>
            </HStack>
          ))}
          <Button
            colorScheme="blue"
            onClick={() => appendUploaderEmail({ email: '' })}
          >
            Add Uploader Email
          </Button>
        </Box>

        <Button type="submit" colorScheme="teal" isLoading={loading}>
          Submit
        </Button>
      </VStack>
    </form>
  );
}

export default CollectionForm;
