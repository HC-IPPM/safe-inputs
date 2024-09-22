import { gql } from '@apollo/client';

export const VALIDATE_COLLECTION_DEF = gql`
  query ValidateCollectionDef(
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
