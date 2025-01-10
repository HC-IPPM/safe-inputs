import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Link,
  Text,
  Box,
  Heading,
  Divider,
} from '@chakra-ui/react';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';

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

  interface FormFieldValues {
    email: string;
  }

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    getValues,
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
      <Box>
        <Heading as="h2" size="lg" mb={6}>
          <Trans>Sign In Via Email</Trans>
        </Heading>
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
      </Box>
    );
  } else {
    return (
      <>
        {responseStatus === 200 ? (
          <Box>
            <Heading as="h2" size="lg" mb={6}>
              <Trans>Sign In Email Sent</Trans>
            </Heading>
            <Text>
              <Trans>
                A log in link has been sent to {getValues('email')}. Open the
                provided link in this browser to complete the sign in process.
              </Trans>
            </Text>
            {devTokenResponse && (
              <>
                <Divider mt={6} mb={6} />
                <Link href={devTokenResponse}>
                  Or click here to complete authentication as{' '}
                  {getValues('email')}
                  (this is only available in local dev)
                </Link>
              </>
            )}
          </Box>
        ) : (
          'Error (UI TODO)</>'
        )}
      </>
    );
  }
}
