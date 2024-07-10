import _ from 'lodash';

import { apply_rules_to_user, validate_user_email_allowed } from 'src/authz.ts';
import type { AuthzRule } from 'src/authz.ts';

import { AppError, app_error_to_gql_error } from 'src/error_utils.ts';

import type { LangsUnion, BilingualKeyUnion } from './lang_utils.ts';

export const resolve_bilingual_scalar =
  <Key extends string>(base_field_name: Key) =>
  <ParentType extends { [k in BilingualKeyUnion<Key>]: any }>(
    parent: ParentType,
    _args: unknown,
    context: { lang: LangsUnion },
  ) =>
    parent[`${base_field_name}_${context.lang}`];

export const with_authz =
  <Parent, Args, Context extends { req?: { user?: Express.User } }, Result>(
    resolver: (parent: Parent, args: Args, context: Context) => Result,
    ...authz_rules: AuthzRule[]
  ): ((parent: Parent, args: Args, context: Context) => Result) =>
  (parent: Parent, args: Args, context: Context) => {
    try {
      if (typeof context?.req?.user === 'undefined') {
        throw new AppError(
          401,
          'Query contains fields requiring an authenticated session. No session found.',
        );
      }

      // may throw an AppError, which will need to be converted to a GraphQLError per
      // https://the-guild.dev/graphql/yoga-server/tutorial/basic/09-error-handling#exposing-safe-error-messages
      apply_rules_to_user(
        context.req.user,
        validate_user_email_allowed,
        ...authz_rules,
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw app_error_to_gql_error(error);
    }

    return resolver(parent, args, context);
  };
