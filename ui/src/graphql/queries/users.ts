import { useQuery } from '@apollo/client';
import type { QueryHookOptions } from '@apollo/client';

import { gql } from 'src/graphql/__generated__/gql.ts';
import {
  UsersQuery,
  UsersQueryVariables,
} from 'src/graphql/__generated__/graphql.ts';
const USERS = gql(`
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
`);

export const useUsers = (
  options?: QueryHookOptions<UsersQuery, UsersQueryVariables>,
) => useQuery<UsersQuery, UsersQueryVariables>(USERS, options);
