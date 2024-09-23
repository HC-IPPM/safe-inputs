import { gql, useMutation } from '@apollo/client';
import type { MutationHookOptions } from '@apollo/client';

import type { CollectionDefInput } from 'src/graphql/schema_common.d.ts';

const COLLECTION_CREATION = gql`
  mutation CollectionCreation($collection_def: CollectionDefInput!) {
    create_collection(collection_def: $collection_def) {
      id
    }
  }
`;

export type CollectionCreationVariables = {
  collection_def: CollectionDefInput;
};

export type CollectionCreationResult = {
  create_collection: {
    id: string;
    __typename: string;
  };
};

export const useCollectionCreation = (
  options?: MutationHookOptions<
    CollectionCreationResult,
    CollectionCreationVariables
  >,
) =>
  useMutation<CollectionCreationResult, CollectionCreationVariables>(
    COLLECTION_CREATION,
    options,
  );
