import type { LinkProps as ChakraLinkProps, As } from '@chakra-ui/react';
import { Link as ChakraLink, forwardRef } from '@chakra-ui/react';

import type { LinkProps as ReactRouterLinkProps } from 'react-router-dom';
import { Link as ReactRouterLink } from 'react-router-dom';

import type { SetRequired } from 'type-fest';

type InAppLinkProps = Omit<
  ChakraLinkProps & ReactRouterLinkProps,
  'isExternal' | 'href' | 'as'
>;

type ExternalLinkProps = Omit<
  SetRequired<ChakraLinkProps, 'href'>,
  'isExternal' | 'to'
>;

export const Link: {
  (props: ExternalLinkProps): JSX.Element;
  (props: InAppLinkProps): JSX.Element;
} = forwardRef<InAppLinkProps | ExternalLinkProps, As>((props, ref) =>
  'href' in props ? (
    <ChakraLink {...props} ref={ref} isExternal={true} />
  ) : (
    <ChakraLink {...props} ref={ref} as={ReactRouterLink} />
  ),
);
