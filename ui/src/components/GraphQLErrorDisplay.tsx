import { Trans } from '@lingui/react/macro';
import { t } from '@lingui/core/macro';
import { ApolloError } from '@apollo/client';
import { Box, Text } from '@chakra-ui/react';

import _ from 'lodash';

interface GraphQLErrorDisplayProps {
  error: ApolloError;
}

// TODO this is fine for current dev purposes, but we'll not necessarily want to display detailed
// network/server error messages to end users in the long term. Only validation errors are the
// end user's buisness and those should be handled directly in forms. Other server errors should
// trigger retries and, worst case, just display a simple message to wait and try submitting again later
// or to contact the team
export function GraphQLErrorDisplay({ error }: GraphQLErrorDisplayProps) {
  if (!error) return null;

  return (
    <Box
      borderWidth={1}
      borderColor="red.500"
      borderRadius="md"
      p={4}
      bg="red.50"
      color="red.700"
      mb={4}
    >
      <Text fontWeight="bold">
        <Trans>Error:</Trans>
      </Text>
      <Text>{error.message || t`An unknown error occurred.`}</Text>

      {error.graphQLErrors.length > 0 && (
        <Box mt={2}>
          <Text fontWeight="bold">
            <Trans>GraphQL Errors:</Trans>
          </Text>
          {error.graphQLErrors.map((err, index) => (
            <Text key={index} ml={2}>
              {err.message}
            </Text>
          ))}
        </Box>
      )}

      {error.networkError && (
        <Box mt={2}>
          <Text fontWeight="bold">
            <Trans>Network Error:</Trans>
          </Text>
          {'statusCode' in error.networkError && (
            <Text>
              <Trans>Status Code: </Trans>
              {error.networkError.statusCode}
            </Text>
          )}
          <Box mt={2}>
            <Text fontWeight="bold">
              <Trans>Details:</Trans>
            </Text>

            {'result' in error.networkError &&
              (typeof error.networkError.result === 'string' ? (
                <Text>{error.networkError.result}</Text>
              ) : (
                _.map(
                  error.networkError.result,
                  ({ error }: { error: any }, key: string) => (
                    <Text key={key} ml={2}>
                      {error.networkError.result}
                    </Text>
                  ),
                )
              ))}
            {'bodyText' in error.networkError && (
              <Text>{error.networkError.bodyText}</Text>
            )}
          </Box>
        </Box>
      )}

      {error.clientErrors.length > 0 && (
        <Box mt={2}>
          <Text fontWeight="bold">
            <Trans>Client Errors:</Trans>
          </Text>
          {error.clientErrors.map((err, index) => (
            <Text key={index} ml={2}>
              {err.message}
            </Text>
          ))}
        </Box>
      )}

      {error.protocolErrors.length > 0 && (
        <Box mt={2}>
          <Text fontWeight="bold">
            <Trans>Protocol Errors:</Trans>
          </Text>
          {error.protocolErrors.map((err, index) => (
            <Text key={index} ml={2}>
              {err.message}
            </Text>
          ))}
        </Box>
      )}
    </Box>
  );
}
