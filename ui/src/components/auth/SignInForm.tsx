import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
} from '@chakra-ui/react';

import { Trans, t } from '@lingui/macro';

import { useState } from 'react';

import { useForm } from 'react-hook-form';

import { useSession } from './session.tsx';

export default function SignInForm({
  post_auth_redirect,
}: {
  post_auth_redirect?: string;
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

  const [response, setResponse] = useState<Response>();

  if (typeof response === 'undefined') {
    const onSubmit = async (values: FormFieldValues) => {
      const response = await signIn(values.email, post_auth_redirect);
      setResponse(response);
    };

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
        <Button
          mt={4}
          colorScheme="teal"
          isLoading={isSubmitting}
          loadingText={t`Signing in`}
          type="submit"
        >
          <Trans>Sign in</Trans>
        </Button>
      </form>
    );
  } else if (response.ok) {
    return <>Success, email sent (UI TODO)</>;
  } else {
    return <>Error (UI TODO)</>;
  }
}
