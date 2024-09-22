import { gql } from '@apollo/client';

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
