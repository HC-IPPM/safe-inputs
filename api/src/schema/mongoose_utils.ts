import { Schema } from 'mongoose';

import { get_lang_suffixed_keys } from './lang_utils.ts';
import type { LangSuffixedKeyUnion } from './lang_utils.ts';

export const string_pkey_type = {
  type: String,
  unique: true,
  required: true,
  index: true,
};
// This probably shouldn't be used outside of the case of optional subdocuments, but it IS required for subdocuments whenever
// the subdocument schema needs a pkey but isn't itself a required field of the parent. If multiple parents ARE
// missing a subdocument which has a required unique index then the database will throw a "dup key: { : null }" error.
// The only solution is to not put unique indexes on the subdocuments or to make sure they're sparse.
export const string_pkey_type_sparse = {
  type: String,
  unique: true,
  sparse: true,
};

export const make_fkey_type = (
  ref: string,
  options: { is_object_id?: boolean; required?: boolean; index?: boolean },
) => ({
  ref,
  type: options.is_object_id ? Schema.ObjectId : String,
  ...(options.required
    ? { required: true, index: options.index }
    : { sparse: options.index }),
});

export const make_lang_suffixed_type = <Key extends string, MongooseType>(
  key: Key,
  type: MongooseType,
) =>
  Object.fromEntries(get_lang_suffixed_keys(key).map((key) => [key, type])) as {
    [k in LangSuffixedKeyUnion<Key>]: MongooseType;
  };
