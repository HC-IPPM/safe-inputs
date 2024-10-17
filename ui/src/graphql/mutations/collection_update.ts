import { useMutation } from '@apollo/client';
import type { MutationHookOptions } from '@apollo/client';

import { gql } from 'src/graphql/__generated__/gql.ts';
import {
  CollectionUpdateMutation,
  CollectionUpdateMutationVariables,
} from 'src/graphql/__generated__/graphql.ts';

export const COLLECTION_UPDATE = gql(`
  mutation CollectionUpdate(
    $collection_id: String!
    $collection_def: CollectionDefInput!
  ) {
    update_collection(
      collection_id: $collection_id
      collection_def: $collection_def
    ) {
      id
    }
  }
`);

export const useCollectionUpdate = (
  options?: MutationHookOptions<
    CollectionUpdateMutation,
    CollectionUpdateMutationVariables
  >,
) =>
  useMutation<CollectionUpdateMutation, CollectionUpdateMutationVariables>(
    COLLECTION_UPDATE,
    options,
  );
