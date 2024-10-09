import { useMutation } from '@apollo/client';
import type { MutationHookOptions } from '@apollo/client';

import { gql } from 'src/graphql/__generated__/gql.ts';

import {
  ColumnDefUpdateMutation,
  ColumnDefUpdateMutationVariables,
} from 'src/graphql/__generated__/graphql.ts';

const COLUMN_DEF_UPDATE = gql(`
  mutation ColumnDefUpdate(
    $collection_id: String!
    $column_id: String!
    $column_def: ColumnDefInput
  ) {
    update_column_def(
      collection_id: $collection_id
      column_id: $column_id
      column_def: $column_def
    ) {
      id
    }
  }
`);

export const useCollumnDefUpdate = (
  options?: MutationHookOptions<
    ColumnDefUpdateMutation,
    ColumnDefUpdateMutationVariables
  >,
) =>
  useMutation<ColumnDefUpdateMutation, ColumnDefUpdateMutationVariables>(
    COLUMN_DEF_UPDATE,
    options,
  );
