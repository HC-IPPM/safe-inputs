import { gql, useQuery } from '@apollo/client';
import type { QueryHookOptions } from '@apollo/client';

import type { User } from 'src/graphql/schema_common.d.ts';

const USERS = gql`
  query Users {
    users {
      id
      email
      created_at
      second_last_login_at
      last_login_at
      is_super_user
      can_own_collections
    }
  }
`;

export type UsersResult = {
  users: User[];
};

export const useUsers = (options?: QueryHookOptions<UsersResult>) =>
  useQuery<UsersResult>(USERS, options);
