import { makeExecutableSchema } from '@graphql-tools/schema';

import {
  user_is_super_user_rule,
  user_can_have_privileges_rule,
  check_authz_rules,
} from 'src/authz.ts';
import { with_authz } from 'src/schema/resolver_utils.ts';

import { UserModel, UserByEmailLoader } from './UserModel.ts';
import type { UserDocument } from './UserModel.ts';

export const UserSchema = makeExecutableSchema({
  typeDefs: `
  type Root {
    user(email: String!): User
    users: [User]
    session: Session
  }
  
  type Session {
    user: User
  }
  
  type User {
    email: String!
    created_at: Float!
    second_last_login_at: Float
    last_login_at: Float
    is_admin: Boolean
    can_own_collections: Boolean
  }
`,
  resolvers: {
    Root: {
      user: with_authz(
        (
          _parent: unknown,
          { email }: { email: string },
          _context: unknown,
          _info: unknown,
        ) => UserByEmailLoader.load(email),
        user_is_super_user_rule,
      ),
      users: with_authz(() => UserModel.find({}), user_is_super_user_rule),
      session: with_authz(
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
