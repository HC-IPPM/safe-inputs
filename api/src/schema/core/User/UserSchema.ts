import { makeExecutableSchema } from '@graphql-tools/schema';

import {
  user_email_is_super_user_rule,
  user_email_can_own_collections_rule,
  check_authz_rules,
} from 'src/authz.ts';
import {
  resolver_with_authz,
  resolve_document_id,
} from 'src/schema/resolver_utils.ts';

import { UserModel, UserByEmailLoader } from './UserModel.ts';
import type { UserDocument } from './UserModel.ts';

export const UserSchema = makeExecutableSchema({
  typeDefs: `
  type QueryRoot {
    user(email: String!): User
    users: [User]
    session: User
  }
  
  type User {
    id: String!
    email: String!
    created_at: Float!
    second_last_login_at: Float
    last_login_at: Float
    is_super_user: Boolean
    can_own_collections: Boolean
  }
`,
  resolvers: {
    QueryRoot: {
      user: resolver_with_authz(
        (
          _parent: unknown,
          { email }: { email: string },
          _context: unknown,
          _info: unknown,
        ) => UserByEmailLoader.load(email),
        user_email_is_super_user_rule,
      ),
      users: resolver_with_authz(
        () => UserModel.find({}),
        user_email_is_super_user_rule,
      ),
      session: resolver_with_authz(
        (_parent: unknown, _args: unknown, context, _info: unknown) =>
          context.req.user.mongoose_doc,
      ),
    },
    User: {
      id: resolve_document_id,
      is_super_user: (
        parent: UserDocument,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) => check_authz_rules(parent, user_email_is_super_user_rule),
      can_own_collections: (
        parent: UserDocument,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) => check_authz_rules(parent, user_email_can_own_collections_rule),
    },
  },
});
