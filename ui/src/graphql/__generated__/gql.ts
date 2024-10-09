/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CollectionCreation($collection_def: CollectionDefInput!) {\n    create_collection(collection_def: $collection_def) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CollectionCreation($collection_def: CollectionDefInput!) {\n    create_collection(collection_def: $collection_def) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CollectionUpdate(\n    $collection_id: String!\n    $collection_def: CollectionDefInput!\n  ) {\n    update_collection(\n      collection_id: $collection_id\n      collection_def: $collection_def\n    ) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CollectionUpdate(\n    $collection_id: String!\n    $collection_def: CollectionDefInput!\n  ) {\n    update_collection(\n      collection_id: $collection_id\n      collection_def: $collection_def\n    ) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ColumnDefCreation(\n    $collection_id: String!\n    $column_def: ColumnDefInput\n  ) {\n    create_column_def(collection_id: $collection_id, column_def: $column_def) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation ColumnDefCreation(\n    $collection_id: String!\n    $column_def: ColumnDefInput\n  ) {\n    create_column_def(collection_id: $collection_id, column_def: $column_def) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ColumnDefUpdate(\n    $collection_id: String!\n    $column_id: String!\n    $column_def: ColumnDefInput\n  ) {\n    update_column_def(\n      collection_id: $collection_id\n      column_id: $column_id\n      column_def: $column_def\n    ) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation ColumnDefUpdate(\n    $collection_id: String!\n    $column_id: String!\n    $column_def: ColumnDefInput\n  ) {\n    update_column_def(\n      collection_id: $collection_id\n      column_id: $column_id\n      column_def: $column_def\n    ) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query CollectionDefInputValidation(\n    $name_en: String!\n    $name_fr: String!\n    $description_en: String!\n    $description_fr: String!\n    $owner_emails: [String!]!\n    $uploader_emails: [String!]!\n    $is_locked: Boolean!\n  ) {\n    validate_collection_def(\n      collection_def: {\n        name_en: $name_en\n        name_fr: $name_fr\n        description_en: $description_en\n        description_fr: $description_fr\n        owner_emails: $owner_emails\n        uploader_emails: $uploader_emails\n        is_locked: $is_locked\n      }\n    ) {\n      name_en {\n        en\n        fr\n      }\n      name_fr {\n        en\n        fr\n      }\n      description_en {\n        en\n        fr\n      }\n      description_fr {\n        en\n        fr\n      }\n      is_locked {\n        en\n        fr\n      }\n      owner_emails {\n        en\n        fr\n      }\n      uploader_emails {\n        en\n        fr\n      }\n    }\n  }\n"): (typeof documents)["\n  query CollectionDefInputValidation(\n    $name_en: String!\n    $name_fr: String!\n    $description_en: String!\n    $description_fr: String!\n    $owner_emails: [String!]!\n    $uploader_emails: [String!]!\n    $is_locked: Boolean!\n  ) {\n    validate_collection_def(\n      collection_def: {\n        name_en: $name_en\n        name_fr: $name_fr\n        description_en: $description_en\n        description_fr: $description_fr\n        owner_emails: $owner_emails\n        uploader_emails: $uploader_emails\n        is_locked: $is_locked\n      }\n    ) {\n      name_en {\n        en\n        fr\n      }\n      name_fr {\n        en\n        fr\n      }\n      description_en {\n        en\n        fr\n      }\n      description_fr {\n        en\n        fr\n      }\n      is_locked {\n        en\n        fr\n      }\n      owner_emails {\n        en\n        fr\n      }\n      uploader_emails {\n        en\n        fr\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query CollectionDetails($collection_id: String!, $lang: String!) {\n    collection(collection_id: $collection_id) {\n      id\n      is_current_version\n      major_ver\n      minor_ver\n      created_by {\n        email\n      }\n      created_at\n      is_locked\n      name_en\n      name_fr\n      description_en\n      description_fr\n      owners {\n        email\n      }\n      uploaders {\n        email\n      }\n      column_defs {\n        id\n        header\n        name(lang: $lang)\n        data_type\n        conditions {\n          condition_type\n          parameters\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query CollectionDetails($collection_id: String!, $lang: String!) {\n    collection(collection_id: $collection_id) {\n      id\n      is_current_version\n      major_ver\n      minor_ver\n      created_by {\n        email\n      }\n      created_at\n      is_locked\n      name_en\n      name_fr\n      description_en\n      description_fr\n      owners {\n        email\n      }\n      uploaders {\n        email\n      }\n      column_defs {\n        id\n        header\n        name(lang: $lang)\n        data_type\n        conditions {\n          condition_type\n          parameters\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query CollectionsInfoCurrentSession($lang: String!) {\n    session {\n      owned_collections {\n        id\n        name(lang: $lang)\n        major_ver\n        minor_ver\n        is_locked\n        created_by {\n          email\n        }\n        created_at\n      }\n      uploadable_collections {\n        id\n        name(lang: $lang)\n        major_ver\n        minor_ver\n        is_locked\n        created_by {\n          email\n        }\n        created_at\n      }\n    }\n  }\n"): (typeof documents)["\n  query CollectionsInfoCurrentSession($lang: String!) {\n    session {\n      owned_collections {\n        id\n        name(lang: $lang)\n        major_ver\n        minor_ver\n        is_locked\n        created_by {\n          email\n        }\n        created_at\n      }\n      uploadable_collections {\n        id\n        name(lang: $lang)\n        major_ver\n        minor_ver\n        is_locked\n        created_by {\n          email\n        }\n        created_at\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query CollectionWithColumnDetails($collection_id: String!, $lang: String!) {\n    collection(collection_id: $collection_id) {\n      id\n      is_current_version\n      major_ver\n      minor_ver\n      created_by {\n        email\n      }\n      owners {\n        email\n      }\n      created_at\n      is_locked\n      name(lang: $lang)\n      column_defs {\n        id\n        header\n        name_en\n        name_fr\n        description_en\n        description_fr\n        data_type\n        conditions {\n          condition_type\n          parameters\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query CollectionWithColumnDetails($collection_id: String!, $lang: String!) {\n    collection(collection_id: $collection_id) {\n      id\n      is_current_version\n      major_ver\n      minor_ver\n      created_by {\n        email\n      }\n      owners {\n        email\n      }\n      created_at\n      is_locked\n      name(lang: $lang)\n      column_defs {\n        id\n        header\n        name_en\n        name_fr\n        description_en\n        description_fr\n        data_type\n        conditions {\n          condition_type\n          parameters\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ColumnDefInputValidation(\n    $collection_id: String!\n    $is_new_column: Boolean!\n    $header: String!\n    $name_en: String!\n    $name_fr: String!\n    $description_en: String!\n    $description_fr: String!\n    $data_type: String!\n    $conditions: [ConditionInput]!\n  ) {\n    validate_column_def(\n      collection_id: $collection_id\n      is_new_column: $is_new_column\n      column_def: {\n        header: $header\n        name_en: $name_en\n        name_fr: $name_fr\n        description_en: $description_en\n        description_fr: $description_fr\n        data_type: $data_type\n        conditions: $conditions\n      }\n    ) {\n      header {\n        en\n        fr\n      }\n      name_en {\n        en\n        fr\n      }\n      name_fr {\n        en\n        fr\n      }\n      description_en {\n        en\n        fr\n      }\n      description_fr {\n        en\n        fr\n      }\n      data_type {\n        en\n        fr\n      }\n      conditions {\n        en\n        fr\n      }\n    }\n  }\n"): (typeof documents)["\n  query ColumnDefInputValidation(\n    $collection_id: String!\n    $is_new_column: Boolean!\n    $header: String!\n    $name_en: String!\n    $name_fr: String!\n    $description_en: String!\n    $description_fr: String!\n    $data_type: String!\n    $conditions: [ConditionInput]!\n  ) {\n    validate_column_def(\n      collection_id: $collection_id\n      is_new_column: $is_new_column\n      column_def: {\n        header: $header\n        name_en: $name_en\n        name_fr: $name_fr\n        description_en: $description_en\n        description_fr: $description_fr\n        data_type: $data_type\n        conditions: $conditions\n      }\n    ) {\n      header {\n        en\n        fr\n      }\n      name_en {\n        en\n        fr\n      }\n      name_fr {\n        en\n        fr\n      }\n      description_en {\n        en\n        fr\n      }\n      description_fr {\n        en\n        fr\n      }\n      data_type {\n        en\n        fr\n      }\n      conditions {\n        en\n        fr\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Users {\n    users {\n      id\n      email\n      created_at\n      second_last_login_at\n      last_login_at\n      is_super_user\n      can_own_collections\n    }\n  }\n"): (typeof documents)["\n  query Users {\n    users {\n      id\n      email\n      created_at\n      second_last_login_at\n      last_login_at\n      is_super_user\n      can_own_collections\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;