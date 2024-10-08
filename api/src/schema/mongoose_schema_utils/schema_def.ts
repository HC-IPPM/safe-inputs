import { Schema } from 'mongoose';

import { get_lang_suffixed_keys } from 'src/schema/lang_utils.ts';
import type { LangSuffixedKeyUnion } from 'src/schema/lang_utils.ts';

import { validation_messages_by_lang_to_error_string } from './validation_utils.ts';

type SchemaDefTypeWithCastMessageMixin<SchemaDefType> = {
  type: SchemaDefType;
  cast: [null, (value: any) => string]; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export const string_type_schema_def_mixin: SchemaDefTypeWithCastMessageMixin<StringConstructor> =
  {
    type: String,
    cast: [
      null,
      (value) =>
        validation_messages_by_lang_to_error_string({
          en: `"${value}" is not a string`,
          fr: 'TODO',
        }),
    ],
  };

export const number_type_schema_def_mixin: SchemaDefTypeWithCastMessageMixin<NumberConstructor> =
  {
    type: Number,
    cast: [
      null,
      (value) =>
        validation_messages_by_lang_to_error_string({
          en: `"${value}" is not a number`,
          fr: 'TODO',
        }),
    ],
  };

export const boolean_type_schema_def_mixin: SchemaDefTypeWithCastMessageMixin<BooleanConstructor> =
  {
    type: Boolean,
    cast: [
      null,
      (value) =>
        validation_messages_by_lang_to_error_string({
          en: `Expected true or false, got "${value}"`,
          fr: 'TODO',
        }),
    ],
  };

export const is_required_schema_def_mixin = {
  // `as ...` necessary because mongoose types needs this to be a tupple, not an array of a union type.
  // Can't use `const` to achieve this, as mongoose's typeing doesn't accept the readonly that adds
  required: [
    true,
    validation_messages_by_lang_to_error_string({
      en: 'Required',
      fr: 'TODO',
    }),
  ] as [true, string],
};

export const primary_key_type_schema_def = {
  ...string_type_schema_def_mixin,
  ...is_required_schema_def_mixin,
  unique: true,
  index: true,
  immutable: true,
};
// This probably shouldn't be used outside of the case of optional subdocuments, but it IS required for subdocuments whenever
// the subdocument schema needs a primary_key but isn't itself a required field of the parent. If multiple parents ARE
// missing a subdocument which has a required unique index then the database will throw a "dup key: { : null }" error.
// The only solution is to not put unique indexes on the subdocuments or to make sure they're sparse.
export const sparse_primary_key_type_schema_def = {
  ...string_type_schema_def_mixin,
  unique: true,
  sparse: true,
};

export const created_at_schema_def = {
  ...number_type_schema_def_mixin,
  ...is_required_schema_def_mixin,
  immutable: true,
  default: function () {
    return Date.now();
  },
};

type ForeignTypeOptions = {
  make_sparse?: boolean;
  make_index?: boolean;
  make_immutable?: boolean;
};
const use_foreign_type_options = (
  options?: ForeignTypeOptions,
): (
  | (typeof is_required_schema_def_mixin & { index: boolean })
  | { sparse: boolean }
) & { immutable: boolean } => ({
  ...(options?.make_sparse
    ? { sparse: !!options?.make_index }
    : { ...is_required_schema_def_mixin, index: !!options?.make_index }),
  immutable: !!options?.make_immutable,
});

// does NOT create an auto-ppulated ref, that only works for foreign _id fields as of the current mongoose implementation
export const make_foreign_key_schema_def = <
  TypeOfForeignKey extends typeof String | typeof Number,
>(
  _ref: string, // unused, require it to be declared for self-documentation
  type_of_foreign_key: TypeOfForeignKey,
  options?: ForeignTypeOptions,
) => ({
  type: type_of_foreign_key,
  ...use_foreign_type_options(options),
});

export const make_foreign_id_ref_schema_def = (
  foreign_model_name: string,
  options?: ForeignTypeOptions,
) => ({
  type: Schema.ObjectId,
  ref: foreign_model_name,
  ...use_foreign_type_options(options),
});

export const make_lang_suffixed_schema_defs = <
  Key extends string,
  SchemaDefTypeDef,
>(
  key: Key,
  type: SchemaDefTypeDef,
) =>
  Object.fromEntries(get_lang_suffixed_keys(key).map((key) => [key, type])) as {
    [k in LangSuffixedKeyUnion<Key>]: SchemaDefTypeDef;
  };
