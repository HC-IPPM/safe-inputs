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

export const GET_USERS = gql`
  query UserInfo {
    users {
      id
      email
      created_at
      second_last_login_at
      last_login_at
      is_admin
      can_own_collections
    }
  }
`;

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

export const UPDATE_COLLECTION = gql`
  mutation CollectionUpdate(
    $collection_id: String!
    $collection_updates: CollectionDefInput!
  ) {
    update_collection(
      collection_id: $collection_id
      collection_updates: $collection_updates
    ) {
      id
    }
  }
`;

export const UPDATE_COLUMN_DEFINITION = gql`
  mutation ColumnUpdate(
    $collection_id: String!
    $column_defs: [ColumnDefInput]
  ) {
    update_column_defs(
      collection_id: $collection_id
      column_defs: $column_defs
    ) {
      id
    }
  }
`;

export const VALIDATE_COLUMN_DEFS = gql`
  mutation ColumnValidation(
    $collection_id: String!
    $column_defs: [ColumnDefInput]
  ) {
    validate_new_column_defs(
      collection_id: $collection_id
      column_defs: $column_defs
    )
  }
`;

export const GET_COLUMN_DETAILS = gql`
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
