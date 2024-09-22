import { gql } from '@apollo/client';

export const USERS = gql`
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
