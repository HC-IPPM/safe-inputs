import { UserModel, UserByEmailLoader } from './UserModel.ts';

export const UserSchema = `
  extend type Root {
    user(email: String): User
    users: [User]
  }
  
  type User {
    email: string
  }
`;

export const UserResolvers = {
  Root: {
    user: (_parent: unknown, { email }: { email: string }, _context: unknown) =>
      UserByEmailLoader.load(email),
    Users: () => UserModel.find({}),
  },
};
