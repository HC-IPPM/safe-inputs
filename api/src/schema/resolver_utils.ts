import _ from 'lodash';

import type { Document } from 'mongoose';

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

export const resolve_lang_suffixed_scalar =
  <Key extends string>(base_field_name: Key) =>
  <
    ParentType extends { [k in LangSuffixedKeyUnion<Key>]: any },
    ContextType extends { lang: LangsUnion },
  >(
    parent: ParentType,
    _args: unknown,
    context: ContextType,
    _info: unknown,
  ) =>
    parent[`${base_field_name}_${context.lang}`];

export const resolver_with_authz =
  <
    Parent,
    Args,
    Context extends { req?: { user?: Express.User } },
    Info extends { fieldName: string },
    Result,
  >(
    resolver: (
      parent: Parent,
      args: Args,
      context: Context,
      info: Info,
    ) => Result,
    ...authz_rules: AuthzRule[]
  ): ((parent: Parent, args: Args, context: Context, info: Info) => Result) =>
  (parent: Parent, args: Args, context: Context, info: Info) => {
    try {
      if (typeof context?.req?.user === 'undefined') {
        throw new AppError(401, 'No session found.');
      }

      // may throw an AppError, which will need to be converted to a GraphQLError per
      // https://the-guild.dev/graphql/yoga-server/tutorial/basic/09-error-handling#exposing-safe-error-messages
      apply_rules_to_user(
        context.req.user,
        user_email_allowed_rule,
        ...authz_rules,
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof AppError && _.includes([401, 403], error.status)) {
        error.message = `Field \`${info.fieldName}\` has unmet authorization requirements. ${error.message}`;
      }

      throw app_error_to_gql_error(error);
    }

    return resolver(parent, args, context, info);
  };
