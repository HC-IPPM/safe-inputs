import { t } from '@lingui/core/macro';
import { Spinner as ChakraSpinner, Skeleton } from '@chakra-ui/react';
import type { SpinnerProps, SkeletonProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export const LoadingSpinner = (props: Omit<SpinnerProps, 'label'>) => (
  <ChakraSpinner label={t`Loading...`} {...props} />
);

export const LoadingBlock = ({
  children,
  isLoading,
  display = 'flex',
  flexGrow = 1,
  ...skeletonProps
}: PropsWithChildren<
  Omit<SkeletonProps, 'label' | 'isLoaded'> & { isLoading: boolean }
>) => (
  <Skeleton
    isLoaded={!isLoading}
    label={isLoading ? t`Loading...` : ''}
    display={display}
    flexGrow={flexGrow}
    {...skeletonProps}
  >
    {children}
  </Skeleton>
);
