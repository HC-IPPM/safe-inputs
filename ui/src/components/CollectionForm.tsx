import { useMutation } from '@apollo/client';
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { t, Trans } from '@lingui/macro';
import _ from 'lodash';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { UPDATE_COLLECTION } from 'src/graphql/queries.ts';
import type { Collection, User } from 'src/graphql/schema.d.ts';

import EmailFields from './EmailField.tsx';
import GraphQLErrorDisplay from './GraphQLErrorDisplay.tsx';

interface CollectionFormProps {
  data: Collection;
}

function CollectionForm({ data }: CollectionFormProps) {
  const { register, handleSubmit, control } = useForm<Collection>({
    defaultValues: data,
  });

  const [updateCollection, { loading, error }] = useMutation(UPDATE_COLLECTION);
  const navigate = useNavigate();
  const toast = useToast();

  // Errors during collection updation are captured by the error state of the mutation
  const onSubmit = async (formData: Collection) => {
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

        <EmailFields
          title=<Trans>Owner Emails</Trans>
          control={control}
          fieldName="owners"
        />

        <EmailFields
          title=<Trans>Uploaders Emails</Trans>
          control={control}
          fieldName="uploaders"
        />

        <Button
          loadingText={t`Updating collection`}
          type="submit"
          colorScheme="teal"
          isLoading={loading}
        >
          <Trans>Update Collection Details</Trans>
        </Button>
      </VStack>
    </form>
  );
}

export default CollectionForm;
