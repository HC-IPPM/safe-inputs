import { makeExecutableSchema } from '@graphql-tools/schema';

import {
  user_is_super_user_rule,
  user_can_have_privileges_rule,
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
    session: Session
  }
  
  type Session {
    user: User
  }
  
  type User {
    id: String!
    email: String!
    created_at: Float!
    second_last_login_at: Float
    last_login_at: Float
    is_admin: Boolean
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
        user_is_super_user_rule,
      ),
      users: resolver_with_authz(
        () => UserModel.find({}),
        user_is_super_user_rule,
      ),
      session: resolver_with_authz(
        (
          _parent: unknown,
          _args: unknown,
          { req }: { req?: { user?: Express.User } },
          _info: unknown,
        ) => ({
          user: req?.user?.mongoose_doc,
        }),
      ),
    },
    User: {
      id: resolve_document_id,
      is_admin: (
        parent: UserDocument,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) => check_authz_rules(parent, user_is_super_user_rule),
      can_own_collections: (
        parent: UserDocument,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) => check_authz_rules(parent, user_can_have_privileges_rule),
    },
  },
});
