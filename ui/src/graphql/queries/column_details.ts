import { gql } from '@apollo/client';

export const COLUMN_DETAILS = gql`
  query ColumnDetails($collection_id: String!, $lang: String!) {
    collection(collection_id: $collection_id) {
      id
      is_current_version
      major_ver
      minor_ver
      created_by {
        email
      }
      owners {
        email
      }
      created_at
      is_locked
      name(lang: $lang)
      column_defs {
        header
        name_en
        name_fr
        description_en
        description_fr
        data_type
        conditions {
          condition_type
          parameters
        }
      }
    }
  }
`;
