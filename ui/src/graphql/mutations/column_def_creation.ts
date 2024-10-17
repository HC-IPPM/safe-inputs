import { useMutation } from '@apollo/client';
import type { MutationHookOptions } from '@apollo/client';

import { gql } from 'src/graphql/__generated__/gql.ts';
import {
  ColumnDefCreationMutation,
  ColumnDefCreationMutationVariables,
} from 'src/graphql/__generated__/graphql.ts';

const COLUMN_DEF_CREATION = gql(`
  mutation ColumnDefCreation(
    $collection_id: String!
    $column_def: ColumnDefInput
  ) {
    create_column_def(collection_id: $collection_id, column_def: $column_def) {
      id
    }
  }
`);

export const useColumnDefCreation = (
  options?: MutationHookOptions<
    ColumnDefCreationMutation,
    ColumnDefCreationMutationVariables
  >,
) =>
  useMutation<ColumnDefCreationMutation, ColumnDefCreationMutationVariables>(
    COLUMN_DEF_CREATION,
    options,
  );
