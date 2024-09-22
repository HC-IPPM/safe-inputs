import { gql } from '@apollo/client';

export const COLUMN_DEFS_INPUT_VALIDATION = gql`
  mutation ColumnDefsInputValidation(
    $collection_id: String!
    $column_defs: [ColumnDefInput]
  ) {
    validate_new_column_defs(
      collection_id: $collection_id
      column_defs: $column_defs
    )
  }
`;
