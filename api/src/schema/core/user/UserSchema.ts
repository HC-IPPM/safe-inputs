import { makeExecutableSchema } from '@graphql-tools/schema';

import { UserModel, UserByEmailLoader } from './UserModel.ts';

export const UserSchema = makeExecutableSchema({
  typeDefs: `
  type Root {
    user(email: String): User
    users: [User]
  }
  
  type User {
    email: String
  }
`,
  resolvers: {
    Root: {
      user: (
        _parent: unknown,
        { email }: { email: string },
        _context: unknown,
      ) => UserByEmailLoader.load(email),
      users: () => UserModel.find({}),
    },
  },
});
