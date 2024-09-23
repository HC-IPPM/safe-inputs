// TODO integrate GraphQL codegen ASAP https://github.com/HC-IPPM/safe-inputs/issues/587
export type CollectionDefInput = {
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  owner_emails: string[];
  uploader_emails: string[];
  is_locked: boolean;
};

export type ColumnDefInput = {
  header: string;
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  data_type: string;
  conditions: {
    condition_type: string;
    parameters: string[];
  }[];
};

export type User = {
  id: string;
  email: string;
  created_at: number;
  second_last_login_at: number;
  last_login_at: number;
  is_super_user: boolean;
  can_own_collections: boolean;
  __typename: string;
};

export type ColumnDef = {
  header: string;
  name_en: string;
  name_fr: string;
  name: string;
  description_en: string;
  description_fr: string;
  description: string;
  data_type: string;
  conditions: {
    condition_type: string;
    parameters: string[];
  }[];
  __typename: string;
};

export type Collection = {
  id: string;
  stable_key: string;
  major_ver: number;
  minor_ver: number;
  is_current_version: boolean;
  created_by: User;
  created_at: number;
  name_en: string;
  name_fr: string;
  name: string;
  description_en: string;
  description_fr: string;
  description_fr: string;
  is_locked: boolean;
  owners: User[];
  uploaders: User[];
  column_defs: ColumnDef[];
  __typename: string;
};

export type ValidationMessages = {
  en: string;
  fr: string;
  __typename: string;
};

export type CollectionCreationResult = {
  create_collection: { id: string; __typename: string };
};
