import { gql, useQuery } from '@apollo/client';
import type { QueryHookOptions } from '@apollo/client';

import type {
  Collection,
  User,
  ColumnDef,
} from 'src/graphql/schema_common.d.ts';

const COLLECTION_DETAILS = gql`
  query CollectionDetails($collection_id: String!, $lang: String!) {
    collection(collection_id: $collection_id) {
      id
      is_current_version
      major_ver
      minor_ver
      created_by {
        email
      }
      created_at
      is_locked
      name_en
      name_fr
      description_en
      description_fr
      owners {
        email
      }
      uploaders {
        email
      }
      column_defs {
        header
        name(lang: $lang)
        data_type
        conditions {
          condition_type
          parameters
        }
      }
    }
  }
`;

export type CollectionDetailsVariables = {
  collection_id: string;
  lang: string;
};

export type CollectionDetailsResult = {
  collection: Pick<
    Collection,
    | 'id'
    | 'is_current_version'
    | 'major_ver'
    | 'minor_ver'
    | 'created_at'
    | 'is_locked'
    | 'name_en'
    | 'name_fr'
    | 'description_en'
    | 'description_fr'
    | '__typename'
  > & { created_by: Pick<User, 'email' | '__typename'> } & {
    owners: Pick<User, 'email' | '__typename'>[];
  } & {
    uploaders: Pick<User, 'email' | '__typename'>[];
  } & {
    column_defs: Pick<
      ColumnDef,
      'header' | 'name' | 'data_type' | 'conditions' | '__typename'
    >[];
  };
};

export const useCollectionDetails = (
  options: QueryHookOptions<
    CollectionDetailsResult,
    CollectionDetailsVariables
  >,
) =>
  useQuery<CollectionDetailsResult, CollectionDetailsVariables>(
    COLLECTION_DETAILS,
    options,
  );
