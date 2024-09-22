import { gql } from '@apollo/client';

export const COLUMN_DEFS_UPDATE = gql`
  mutation ColumnDefsUpdate(
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
