import type { LinkProps as ChakraLinkProps } from '@chakra-ui/react';
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

const is_props_for_external_link = (
  props: InAppLinkProps | ExternalLinkProps,
): props is ExternalLinkProps => 'href' in props;

export const Link: {
  (props: ExternalLinkProps): JSX.Element;
  (props: InAppLinkProps): JSX.Element;
} = forwardRef<
  InAppLinkProps | ExternalLinkProps,
  typeof ChakraLink | typeof ReactRouterLink
>((props, ref) =>
  is_props_for_external_link(props) ? (
    <ChakraLink {...props} ref={ref} isExternal={true} />
  ) : (
    <ChakraLink {...props} ref={ref} as={ReactRouterLink} />
  ),
);
