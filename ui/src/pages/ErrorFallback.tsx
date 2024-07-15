import React from 'react';
import { Box, Button } from '@chakra-ui/react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <Box bg="red.100" p={4} borderRadius="md" mb={4} textAlign="center">
      <h1>Something went wrong. Please contact the developers</h1>
      <Box mt={2}>
        <pre>{error.message}</pre>
      </Box>
      <Box mt={4}>
        <Button onClick={resetErrorBoundary} colorScheme="blue">
          Try Again
        </Button>
      </Box>
    </Box>
  );
};

export default ErrorFallback;
