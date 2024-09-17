import { Box, Button, FormLabel, HStack, Input } from '@chakra-ui/react';
import { Trans } from '@lingui/macro';
import { Control, Controller, useFieldArray } from 'react-hook-form';

import { Collection } from 'src/graphql/schema.ts';

type EmailFieldName = 'owners' | 'uploaders';

interface EmailFieldsProps {
  title: React.ReactNode;
  control: Control<Collection>;
  fieldName: EmailFieldName;
}

function EmailFields({ title, control, fieldName }: EmailFieldsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName,
  });

  return (
    <Box>
      <FormLabel fontWeight="bold">{title}</FormLabel>
      {fields.map((field, index: number) => (
        <HStack key={field.id} spacing={4} mb={2}>
          <Controller
            control={control}
            name={`${fieldName}.${index}.email` as const}
            render={({ field }) => (
              <Input
                type="email"
                placeholder="Enter email"
                {...field}
                value={field.value || ''}
                isRequired
              />
            )}
          />
          <Button colorScheme="red" onClick={() => remove(index)}>
            <Trans>Remove</Trans>
          </Button>
        </HStack>
      ))}
      <Button colorScheme="blue" onClick={() => append({ email: '' })}>
        <Trans>Add Email</Trans>
      </Button>
    </Box>
  );
}

export default EmailFields;
