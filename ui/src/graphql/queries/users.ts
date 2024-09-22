import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query UserInfo {
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
