import { makeExecutableSchema } from '@graphql-tools/schema';

import { validate_user_is_super_user } from 'src/authz.ts';
import { with_authz } from 'src/schema/resolver_utils.ts';

import { UserModel, UserByEmailLoader } from './UserModel.ts';

export const UserSchema = makeExecutableSchema({
  typeDefs: `
  type Root {
    user(email: String): User
    users: [User]
  }
  
  type User {
    email: String!
    created_at: Float!
    second_last_login_at: Float
    last_login_at: Float
  }
`,
  resolvers: {
    Root: {
      user: with_authz(
        (_parent: unknown, { email }: { email: string }, _context: unknown) =>
          UserByEmailLoader.load(email),
        validate_user_is_super_user,
      ),
      users: with_authz(() => UserModel.find({}), validate_user_is_super_user),
    },
  },
});
