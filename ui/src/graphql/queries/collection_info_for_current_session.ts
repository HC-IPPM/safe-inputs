import { useQuery } from '@apollo/client';
import type { QueryHookOptions } from '@apollo/client';

import { gql } from 'src/graphql/__generated__/gql.ts';
import {
  CollectionsInfoCurrentSessionQuery,
  CollectionsInfoCurrentSessionQueryVariables,
} from 'src/graphql/__generated__/graphql.ts';
const COLLECTION_INFO_FOR_CURRENT_SESSION = gql(`
  query CollectionsInfoCurrentSession($lang: String!) {
    session {
      owned_collections {
        id
        name(lang: $lang)
        major_ver
        minor_ver
        is_locked
        created_by {
          email
        }
        created_at
      }
      uploadable_collections {
        id
        name(lang: $lang)
        major_ver
        minor_ver
        is_locked
        created_by {
          email
        }
        created_at
      }
    }
  }
`);

export const useCollectionInfoForCurrentSession = (
  options: QueryHookOptions<
    CollectionsInfoCurrentSessionQuery,
    CollectionsInfoCurrentSessionQueryVariables
  >,
) =>
  useQuery<
    CollectionsInfoCurrentSessionQuery,
    CollectionsInfoCurrentSessionQueryVariables
  >(COLLECTION_INFO_FOR_CURRENT_SESSION, options);
