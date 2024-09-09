import { ApolloError } from '@apollo/client';
import { Box, Text } from '@chakra-ui/react';

interface GraphQLErrorDisplayProps {
  error: ApolloError;
}

function GraphQLErrorDisplay({ error }: GraphQLErrorDisplayProps) {
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
      <Text fontWeight="bold">Error:</Text>
      <Text>{error.message || 'An unknown error occurred.'}</Text>

      {error.graphQLErrors.length > 0 && (
        <Box mt={2}>
          <Text fontWeight="bold">GraphQL Errors:</Text>
          {error.graphQLErrors.map((err, index) => (
            <Text key={index} ml={2}>
              {err.message}
            </Text>
          ))}
        </Box>
      )}

      {error.networkError && (
        <Box mt={2}>
          <Text fontWeight="bold">Network Error:</Text>
          <Text>Status Code: {error.networkError?.statusCode}</Text>
          {error.networkError.result && error.networkError.result.errors && (
            <Box mt={2}>
              <Text fontWeight="bold">Details:</Text>
              {error.networkError.result.errors.map(
                (err: any, index: number) => (
                  <Text key={index} ml={2}>
                    {err.message}
                  </Text>
                ),
              )}
            </Box>
          )}
        </Box>
      )}

      {error.clientErrors.length > 0 && (
        <Box mt={2}>
          <Text fontWeight="bold">Client Errors:</Text>
          {error.clientErrors.map((err, index) => (
            <Text key={index} ml={2}>
              {err.message}
            </Text>
          ))}
        </Box>
      )}

      {error.protocolErrors.length > 0 && (
        <Box mt={2}>
          <Text fontWeight="bold">Protocol Errors:</Text>
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

export default GraphQLErrorDisplay;
