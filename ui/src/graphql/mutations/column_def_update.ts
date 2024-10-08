import { gql, useMutation } from '@apollo/client';
import type { MutationHookOptions } from '@apollo/client';

import type { ColumnDefInput } from 'src/graphql/schema_common.d.ts';

const COLUMN_DEF_UPDATE = gql`
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
`;

export type CollumnDefUpdateVariables = {
  collection_id: string;
  column_id: string;
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
