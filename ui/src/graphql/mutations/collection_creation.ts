import { gql } from '@apollo/client';

export const CREATE_COLLECTION = gql`
  mutation CreateCollection(
    $name_en: String!
    $name_fr: String!
    $description_en: String!
    $description_fr: String!
    $owner_emails: [String!]!
    $uploader_emails: [String!]!
    $is_locked: Boolean!
  ) {
    create_collection_init(
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
      id
    }
  }
`;
