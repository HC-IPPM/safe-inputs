import type { LinkProps as ChakraLinkLinkProps } from '@chakra-ui/react';
import { Link as ChakraLink } from '@chakra-ui/react';

import type { LinkProps as ReactRouterLinkProps } from 'react-router-dom';
import { Link as ReactRouterLink } from 'react-router-dom';

export const RouterLink = (
  props: ChakraLinkLinkProps & ReactRouterLinkProps,
) => <ChakraLink as={ReactRouterLink} {...props} />;
