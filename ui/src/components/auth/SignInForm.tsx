import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
} from '@chakra-ui/react';

import { Trans, t } from '@lingui/macro';

import { useForm } from 'react-hook-form';

import { useSession } from './session.tsx';

export default function SignInForm({
  callbackUrl = 'http://google.com',
}: {
  callbackUrl: string;
}) {
  const { signIn } = useSession({
    allow_unauthenticated: true,
  });

  type FormFieldValues = {
    email: string;
  };

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormFieldValues>();

  const onSubmit = async (values: FormFieldValues) =>
    await signIn(values.email, callbackUrl);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.email}>
        <FormLabel htmlFor="email">
          <Trans>Email</Trans>
        </FormLabel>
        <Input
          id="email"
          placeholder={t`Email`}
          {...register('email', {
            required: t`Required`,
          })}
        />
        <FormErrorMessage>
          {errors.email && errors.email.message}
        </FormErrorMessage>
      </FormControl>
      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        <Trans>Sign in</Trans>
      </Button>
    </form>
  );
}
