import { useQuery } from '@apollo/client';
import type { QueryHookOptions } from '@apollo/client';

import { gql } from 'src/graphql/__generated__/gql.ts';
import {
  CollectionWithColumnDetailsQuery,
  CollectionWithColumnDetailsQueryVariables,
} from 'src/graphql/__generated__/graphql.ts';

const COLLECTION_WITH_COLUMN_DETAILS = gql(`
  query CollectionWithColumnDetails($collection_id: String!, $lang: String!) {
    collection(collection_id: $collection_id) {
      id
      is_current_version
      major_ver
      minor_ver
      created_by {
        email
      }
      owners {
        email
      }
      created_at
      is_locked
      name(lang: $lang)
      column_defs {
        id
        header
        name_en
        name_fr
        description_en
        description_fr
        data_type
        conditions {
          condition_type
          parameters
        }
      }
    }
  }
`);

export const useCollectionWithColumnDetails = (
  options: QueryHookOptions<
    CollectionWithColumnDetailsQuery,
    CollectionWithColumnDetailsQueryVariables
  >,
) =>
  useQuery<
    CollectionWithColumnDetailsQuery,
    CollectionWithColumnDetailsQueryVariables
  >(COLLECTION_WITH_COLUMN_DETAILS, options);
