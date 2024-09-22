import { gql } from '@apollo/client';

export const GET_HOME_INFO = gql`
  query HomePageInfo($lang: String!) {
    session {
      owned_collections {
        id
        name(lang: $lang)
        major_ver
        minor_ver
        is_locked
        created_by {
          email
        }
        created_at
      }
      uploadable_collections {
        id
        name(lang: $lang)
        major_ver
        minor_ver
        is_locked
        created_by {
          email
        }
        created_at
      }
    }
  }
`;
