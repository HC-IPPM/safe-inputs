import { useMutation } from '@apollo/client';
import type { MutationHookOptions } from '@apollo/client';

import { gql } from 'src/graphql/__generated__/gql.ts';

import {
  CollectionCreationMutation,
  CollectionCreationMutationVariables,
} from 'src/graphql/__generated__/graphql.ts';

const COLLECTION_CREATION = gql(`
  mutation CollectionCreation($collection_def: CollectionDefInput!) {
    create_collection(collection_def: $collection_def) {
      id
    }
  }
`);

export const useCollectionCreation = (
  options?: MutationHookOptions<
    CollectionCreationMutation,
    CollectionCreationMutationVariables
  >,
) =>
  useMutation<CollectionCreationMutation, CollectionCreationMutationVariables>(
    COLLECTION_CREATION,
    options,
  );
