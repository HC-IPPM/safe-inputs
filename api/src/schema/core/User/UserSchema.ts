import { makeExecutableSchema } from '@graphql-tools/schema';

import {
  validate_user_is_super_user,
  validate_user_can_have_privileges,
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
        validate_user_is_super_user,
      ),
      users: with_authz(() => UserModel.find({}), validate_user_is_super_user),
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
      ) => {
        try {
          validate_user_is_super_user(parent);
          return true;
        } catch {
          return false;
        }
      },
      can_own_collections: (
        parent: UserDocument,
        _args: unknown,
        _context: unknown,
        _info: unknown,
      ) => {
        try {
          validate_user_can_have_privileges(parent);
          return true;
        } catch {
          return false;
        }
      },
    },
  },
});
