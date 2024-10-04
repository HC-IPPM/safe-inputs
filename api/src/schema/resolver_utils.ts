import _ from 'lodash';

import type { Document } from 'mongoose';

import type { Paths } from 'type-fest';

import { user_is_authenticated } from 'src/authn.ts';
import { apply_rules_to_user, user_email_allowed_rule } from 'src/authz.ts';
import type { AuthzRule } from 'src/authz.ts';

import { AppError, app_error_to_gql_error } from 'src/error_utils.ts';

import type { LangsUnion, LangSuffixedKeyUnion } from './lang_utils.ts';

export const resolve_document_id = <ParentType extends Document>(
  parent: ParentType,
  _args: unknown,
  _context: unknown,
  _info: unknown,
) => parent._id;

export const context_has_authenticated_user = <
  Context extends {
    req?: { user?: Express.User | Express.AuthenticatedUser };
  },
>(
  context: Context,
): context is Context & {
  req: { user: Express.AuthenticatedUser };
} => user_is_authenticated(context.req?.user);

export const resolver_with_authz =
  <
    Parent,
    Args,
    Context extends {
      req?: { user?: Express.User | Express.AuthenticatedUser };
    },
    Info extends { fieldName: string },
    Result,
  >(
    resolver: (
      parent: Parent,
      args: Args,
      context: Context & { req: { user: Express.AuthenticatedUser } },
      info: Info,
    ) => Result,
    ...authz_rules: AuthzRule[]
  ): ((parent: Parent, args: Args, context: Context, info: Info) => Result) =>
  (parent: Parent, args: Args, context: Context, info: Info) => {
    try {
      if (!context_has_authenticated_user(context)) {
        throw new AppError(401, 'User is not authenticated.');
      }

      // may throw an AppError, which will need to be converted to a GraphQLError per
      // https://the-guild.dev/graphql/yoga-server/tutorial/basic/09-error-handling#exposing-safe-error-messages
      apply_rules_to_user(
        context.req.user,
        user_email_allowed_rule,
        ...authz_rules,
      );

      return resolver(parent, args, context, info);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof AppError && _.includes([401, 403], error.status)) {
        error.message = `Field \`${info.fieldName}\` has unmet authorization requirements. ${error.message}`;
      }

      throw app_error_to_gql_error(error);
    }
  };

// Using a trick with an outer no-op function layer to achieve partial type argument inference,
// a long-missing feature in TypeScript https://github.com/microsoft/TypeScript/issues/26242.
// It creates some ugly syntax where calling this function looks like `make_nested_scalar_resolver<SomeDocument>()("top_level_key", "key")`,
// but it gives proper type checking
export const make_deep_scalar_resolver =
  <Document>() =>
  <Path extends Paths<Document>>(path: Path) =>
  (parent: Document, _args: unknown, _context: unknown, _info: unknown) =>
    _.get(parent, path);

// Similar to `make_deep_scalar_resolver`, but with slightly more complex typing due to appending lang values to the provided path.
// The typing complains when we want it to, but with a slightly more opaque error
export const make_deep_lang_suffixed_scalar_resolver =
  <Document>() =>
  <UnsuffixedPath extends string>(
    unsuffixed_path: `${LangSuffixedKeyUnion<UnsuffixedPath>}` extends Paths<Document>
      ? UnsuffixedPath
      : never,
  ) =>
  <ArgsType extends { lang: LangsUnion }>(
    parent: Document,
    args: ArgsType,
    _context: unknown,
    _info: unknown,
  ) =>
    _.get(parent, `${unsuffixed_path}_${args.lang}`);
