import { gql, useMutation } from '@apollo/client';
import type { MutationHookOptions } from '@apollo/client';

import type { ColumnDefInput } from 'src/graphql/schema_common.d.ts';

const COLUMN_DEF_CREATION = gql`
  mutation ColumnDefCreation(
    $collection_id: String!
    $column_def: ColumnDefInput
  ) {
    create_column_def(collection_id: $collection_id, column_def: $column_def) {
      id
    }
  }
`;

export type CollumnDefCreationVariables = {
  collection_id: string;
  column_def: ColumnDefInput;
};

export type CollumnDefCreationResult = {
  create_column_def: {
    id: string;
    __typename: string;
  };
};

export const useCollumnDefCreation = (
  options?: MutationHookOptions<
    CollumnDefCreationResult,
    CollumnDefCreationVariables
  >,
) =>
  useMutation<CollumnDefCreationResult, CollumnDefCreationVariables>(
    COLUMN_DEF_CREATION,
    options,
  );
