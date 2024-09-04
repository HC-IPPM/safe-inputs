import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Link,
} from '@chakra-ui/react';

import { Trans, t } from '@lingui/macro';

import { useState } from 'react';

import { useForm } from 'react-hook-form';

import { useSession } from './session.tsx';

const { IS_LOCAL_DEV } = ENV;

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

  const [responseStatus, setResponseStatus] = useState<Response['status']>();
  const [devTokenResponse, setDevTokenResponse] = useState<string>();

  if (typeof responseStatus === 'undefined') {
    const onSubmit = async (values: FormFieldValues) => {
      const { response, data } = await signIn(values.email, post_auth_redirect);
      setResponseStatus(response.status);

      if (IS_LOCAL_DEV) {
        if (data?.verification_url) {
          setDevTokenResponse(data?.verification_url);
        }
      }
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
  } else {
    return (
      <>
        {responseStatus === 200 ? (
          devTokenResponse ? (
            <Link href={devTokenResponse}>
              Click here to complete authentication (local dev only)
            </Link>
          ) : (
            'Success, email sent (UI TODO)'
          )
        ) : (
          'Error (UI TODO)</>'
        )}
      </>
    );
  }
}
