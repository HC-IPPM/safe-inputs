import { gql, useMutation } from '@apollo/client';
import type { MutationHookOptions } from '@apollo/client';

import type { CollectionDefInput } from 'src/graphql/schema_common.d.ts';

export const COLLECTION_UPDATE = gql`
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
`;

export type CollectionUpdateVariables = {
  collection_id: string;
  collection_def: CollectionDefInput;
};

export type CollectionUpdateResult = {
  update_collection: {
    id: string;
    __typename: string;
  };
};

export const useCollectionUpdate = (
  options?: MutationHookOptions<
    CollectionUpdateResult,
    CollectionUpdateVariables
  >,
) =>
  useMutation<CollectionUpdateResult, CollectionUpdateVariables>(
    COLLECTION_UPDATE,
    options,
  );
