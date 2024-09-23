import { gql, useQuery } from '@apollo/client';
import type { QueryHookOptions } from '@apollo/client';

import type {
  Collection,
  User,
  ColumnDef,
} from 'src/graphql/schema_common.d.ts';

const COLLECTION_WITH_COLUMN_DETAILS = gql`
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
`;

export type CollectionWithColumnDetailsVariables = {
  collection_id: string;
  lang: string;
};

export type CollectionWithColumnDetailsResult = {
  collection: Pick<
    Collection,
    | 'id'
    | 'is_current_version'
    | 'major_ver'
    | 'minor_ver'
    | 'created_at'
    | 'is_locked'
    | 'name'
    | '__typename'
  > & { created_by: Pick<User, 'email' | '__typename'> } & {
    owners: Pick<User, 'email' | '__typename'>[];
  } & {
    column_defs: Pick<
      ColumnDef,
      | 'header'
      | 'name_en'
      | 'name_fr'
      | 'description_en'
      | 'description_fr'
      | 'data_type'
      | 'conditions'
      | '__typename'
    >[];
  };
};

export const useCollectionWithColumnDetails = (
  options: QueryHookOptions<
    CollectionWithColumnDetailsResult,
    CollectionWithColumnDetailsVariables
  >,
) =>
  useQuery<
    CollectionWithColumnDetailsResult,
    CollectionWithColumnDetailsVariables
  >(COLLECTION_WITH_COLUMN_DETAILS, options);
