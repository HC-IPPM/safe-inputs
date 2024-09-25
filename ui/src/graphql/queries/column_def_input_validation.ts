import { gql, useQuery, useLazyQuery } from '@apollo/client';
import type { QueryHookOptions } from '@apollo/client';

import type {
  ColumnDefInput,
  ValidationMessages,
} from 'src/graphql/schema_common.d.ts';

const COLUMN_DEF_INPUT_VALIDATION = gql`
  query ColumnDefInputValidation(
    $collection_id: String!
    $is_new_column: Boolean!
    $header: String!
    $name_en: String!
    $name_fr: String!
    $description_en: String!
    $description_fr: String!
    $data_type: String!
    $conditions: [ConditionInput]!
  ) {
    validate_column_def(
      collection_id: $collection_id
      is_new_column: $is_new_column
      column_def: {
        header: $header
        name_en: $name_en
        name_fr: $name_fr
        description_en: $description_en
        description_fr: $description_fr
        data_type: $data_type
        conditions: $conditions
      }
    ) {
      header {
        en
        fr
      }
      name_en {
        en
        fr
      }
      name_fr {
        en
        fr
      }
      description_en {
        en
        fr
      }
      description_fr {
        en
        fr
      }
      data_type {
        en
        fr
      }
      conditions {
        en
        fr
      }
    }
  }
`;

export type ColumnDefInputValidationVariables = ColumnDefInput & {
  collection_id: string;
  is_new_column: boolean;
};

export type ColumnDefInputValidationResult = {
  validate_column_def: {
    header?: ValidationMessages;
    name_en?: ValidationMessages;
    name_fr?: ValidationMessages;
    description_en?: ValidationMessages;
    description_fr?: ValidationMessages;
    data_type?: ValidationMessages;
    condition?: ValidationMessages[];
    __typename: string;
  };
};

export const useColumnDefInputValidation = (
  options?: QueryHookOptions<
    ColumnDefInputValidationVariables,
    ColumnDefInputValidationResult
  >,
) =>
  useQuery<ColumnDefInputValidationVariables, ColumnDefInputValidationResult>(
    COLUMN_DEF_INPUT_VALIDATION,
    options,
  );

export const useLazyColumnDefInputValidation = () =>
  // Possibly a bug, but the useLazyQuery generic args get reversed somehow?
  useLazyQuery<
    ColumnDefInputValidationResult,
    ColumnDefInputValidationVariables
  >(COLUMN_DEF_INPUT_VALIDATION);
