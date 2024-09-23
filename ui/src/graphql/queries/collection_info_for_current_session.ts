import { gql, useQuery } from '@apollo/client';
import type { QueryHookOptions } from '@apollo/client';

import type { Collection, User } from 'src/graphql/schema_common.d.ts';

const COLLECTION_INFO_FOR_CURRENT_SESSION = gql`
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
`;

export type CollectionInfoForCurrentSessionVariables = {
  lang: string;
};

export type CollectionInfoResult = Pick<
  Collection,
  | 'id'
  | 'major_ver'
  | 'minor_ver'
  | 'created_at'
  | 'is_locked'
  | 'name'
  | '__typename'
> & { created_by: Pick<User, 'email' | '__typename'> };

export type CollectionInfoForCurrentSessionResult = {
  session: {
    owned_collections: CollectionInfoResult[];
    uploadable_collections: CollectionInfoResult[];
  };
};

export const useCollectionInfoForCurrentSession = (
  options: QueryHookOptions<
    CollectionInfoForCurrentSessionResult,
    CollectionInfoForCurrentSessionVariables
  >,
) =>
  useQuery<
    CollectionInfoForCurrentSessionResult,
    CollectionInfoForCurrentSessionVariables
  >(COLLECTION_INFO_FOR_CURRENT_SESSION, options);
