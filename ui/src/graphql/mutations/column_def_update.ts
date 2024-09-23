import { gql, useMutation } from '@apollo/client';
import type { MutationHookOptions } from '@apollo/client';

import type { ColumnDefInput } from 'src/graphql/schema_common.d.ts';

const COLUMN_DEF_UPDATE = gql`
  mutation ColumnDefUpdate(
    $collection_id: String!
    $is_new_column: Boolean!
    $column_def: ColumnDefInput
  ) {
    update_column_def(
      collection_id: $collection_id
      is_new_column: $is_new_column
      column_def: $column_def
    ) {
      id
    }
  }
`;

export type CollumnDefUpdateVariables = {
  collection_id: string;
  is_new_column: boolean;
  column_def: ColumnDefInput;
};

export type CollumnDefUpdateResult = {
  update_column_def: {
    id: string;
    __typename: string;
  };
};

export const useCollumnDefUpdate = (
  options?: MutationHookOptions<
    CollumnDefUpdateResult,
    CollumnDefUpdateVariables
  >,
) =>
  useMutation<CollumnDefUpdateResult, CollumnDefUpdateVariables>(
    COLUMN_DEF_UPDATE,
    options,
  );
