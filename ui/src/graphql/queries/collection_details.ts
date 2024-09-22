import { gql } from '@apollo/client';

export const GET_COLLECTION_DETAILS = gql`
  query CollectionDetails($collection_id: String!, $lang: String!) {
    collection(collection_id: $collection_id) {
      id
      is_current_version
      major_ver
      minor_ver
      created_by {
        email
      }
      created_at
      is_locked
      name_en
      name_fr
      description_en
      description_fr
      owners {
        email
      }
      uploaders {
        email
      }
      column_defs {
        header
        name(lang: $lang)
        data_type
        conditions {
          condition_type
          parameters
        }
      }
    }
  }
`;
