import { gql, useQuery, useLazyQuery } from '@apollo/client';
import type { QueryHookOptions } from '@apollo/client';

import type {
  CollectionDefInput,
  ValidationMessages,
} from 'src/graphql/schema_common.d.ts';

const COLLECTION_DEF_INPUT_VALIDATION = gql`
  query CollectionDefInputValidation(
    $name_en: String!
    $name_fr: String!
    $description_en: String!
    $description_fr: String!
    $owner_emails: [String!]!
    $uploader_emails: [String!]!
    $is_locked: Boolean!
  ) {
    validate_collection_def(
      collection_def: {
        name_en: $name_en
        name_fr: $name_fr
        description_en: $description_en
        description_fr: $description_fr
        owner_emails: $owner_emails
        uploader_emails: $uploader_emails
        is_locked: $is_locked
      }
    ) {
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
      is_locked {
        en
        fr
      }
      owner_emails {
        en
        fr
      }
      uploader_emails {
        en
        fr
      }
    }
  }
`;

export type CollectionDefValidation = {
  validate_collection_def: {
    name_en?: ValidationMessages;
    name_fr?: ValidationMessages;
    description_en?: ValidationMessages;
    description_fr?: ValidationMessages;
    is_locked?: ValidationMessages;
    owner_emails?: ValidationMessages;
    uploader_emails?: ValidationMessages;
    __typename: string;
  };
};

export const useCollectionDefInputValidation = (
  options?: QueryHookOptions<CollectionDefInput, CollectionDefValidation>,
) =>
  useQuery<CollectionDefInput, CollectionDefValidation>(
    COLLECTION_DEF_INPUT_VALIDATION,
    options,
  );

export const useLazyCollectionDefInputValidation = () =>
  // Possibly a bug, but the useLazyQuery generic args get reversed somehow?
  useLazyQuery<CollectionDefValidation, CollectionDefInput>(
    COLLECTION_DEF_INPUT_VALIDATION,
  );
