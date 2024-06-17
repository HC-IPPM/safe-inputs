import type { LinkProps as ChakraLinkProps } from '@chakra-ui/react';
import { Link as ChakraLink } from '@chakra-ui/react';

import type { LinkProps as ReactRouterLinkProps } from 'react-router-dom';
import { Link as ReactRouterLink } from 'react-router-dom';

import type { SetRequired } from 'type-fest';

type InAppLinkProps = Omit<
  ChakraLinkProps & ReactRouterLinkProps,
  'isExternal' | 'href' | 'as'
>;

type ExternalLinkProps = Omit<
  SetRequired<ChakraLinkProps, 'href'>,
  'isExternal'
>;

function Link(props: ExternalLinkProps): JSX.Element;
function Link(props: InAppLinkProps): JSX.Element;
function Link(props: ExternalLinkProps | InAppLinkProps): JSX.Element {
  return 'href' in props ? (
    <ChakraLink {...props} isExternal={true} />
  ) : (
    <ChakraLink {...props} as={ReactRouterLink} />
  );
}

export { Link };
