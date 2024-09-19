import _ from 'lodash';
import type { Model, ValidatorProps, SchemaValidator } from 'mongoose';
import { Schema, Error as MongooseError, HydratedDocument } from 'mongoose';

import type { PartialDeep } from 'type-fest';

import { get_lang_suffixed_keys, langs } from './lang_utils.ts';
import type { LangSuffixedKeyUnion, LangsUnion } from './lang_utils.ts';

type ValidationMessagesByLang = {
  [key in LangsUnion]: string;
};
export const validation_messages_by_lang_to_error_string = (
  validation_messages_by_lang: ValidationMessagesByLang,
) => JSON.stringify(validation_messages_by_lang);

const validation_error_string_to_messages_by_lang = (
  multilang_validation_string: string,
) => {
  const validation_messages = (() => {
    try {
      return JSON.parse(multilang_validation_string);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(
        `Expected validation error string to be valid JSON, got: \`${multilang_validation_string}\``,
        {
          cause: error,
        },
      );
    }
  })();

  if (
    _.every(
      langs,
      (lang_key) =>
        lang_key in validation_messages &&
        typeof validation_messages[lang_key] === 'string',
    )
  ) {
    return validation_messages as ValidationMessagesByLang;
  } else {
    throw new Error(
      `Missing lang keys in validation string: \`${multilang_validation_string}\``,
    );
  }
};

export const get_validation_errors = async <ModelInterface>(
  model: Model<ModelInterface>,
  input: PartialDeep<ModelInterface>,
  paths_to_validate: [string],
) => {
  try {
    await model.validate(input, paths_to_validate);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof MongooseError.ValidationError) {
      return _.chain(error.errors)
        .mapValues((error) =>
          validation_error_string_to_messages_by_lang(error.message),
        )
        .map((validation_messages, path_string) => {
          const reversed_path_keys = _.chain(path_string)
            .split('.')
            .reverse()
            .value();

          type ValidationMessagesByExpandedPath = {
            [key_in_path: string]:
              | ValidationMessagesByExpandedPath
              | ValidationMessagesByLang;
          };

          return _.reduce(
            _.tail(reversed_path_keys),
            (accumulator, key_in_path) => ({ [key_in_path]: accumulator }),
            {
              [_.head(reversed_path_keys) as string]: validation_messages,
            } as ValidationMessagesByExpandedPath,
          );
        })
        .thru((validation_messages_by_path_expanded) =>
          _.merge({}, ...validation_messages_by_path_expanded),
        )
        .value();
    } else {
      throw error;
    }
  }
};

type TypeWithCastMessageMixin<Type> = {
  type: Type;
  cast: [null, (value: any) => string]; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export const string_type_mixin: TypeWithCastMessageMixin<StringConstructor> = {
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

export const number_type_mixin: TypeWithCastMessageMixin<NumberConstructor> = {
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

export const boolean_type_mixin: TypeWithCastMessageMixin<BooleanConstructor> =
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

export const created_at_mixin = {
  ...number_type_mixin,
  default: function () {
    return Date.now();
  },
};

export const is_required_mixin = {
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

export type ValidatorFunction<FieldType, SchemaInterface> = (
  value: FieldType,
  validation_props?: ValidatorProps,
  document?: HydratedDocument<SchemaInterface>,
) =>
  | undefined
  | ValidationMessagesByLang
  | Promise<undefined | ValidationMessagesByLang>;

export const make_validation_mixin = <FieldType, SchemaInterface>(
  ...validator_funcs: ValidatorFunction<FieldType, SchemaInterface>[]
): { validate: SchemaValidator<FieldType, SchemaInterface> } => ({
  validate: {
    propsParameter: true,
    validator: function (value: FieldType, validation_props) {
      return Promise.all(
        validator_funcs.map((func) =>
          func(
            value,
            validation_props,
            // mongoose's typing of the validator function's `this` is the SchemaInterface at this point,
            // but in reality it's a document instance being passed here
            this as HydratedDocument<SchemaInterface>,
          ),
        ),
      ).then((validation_results) => {
        const validation_error_messages = _.filter(
          validation_results,
          (result) => typeof result !== 'undefined',
        );

        if (_.isEmpty(validation_error_messages)) {
          return true;
        } else {
          throw new Error(
            validation_messages_by_lang_to_error_string(
              _.mergeWith(
                { en: 'Validation issues:', fr: 'TODO' },
                ...validation_error_messages,
                (
                  message_accumulator: string,
                  validation_error_message: string,
                ) => `${message_accumulator}\n\t• ${validation_error_message}`,
              ),
            ),
          );
        }
      });
    },
    message: (validation_props) => validation_props.reason?.message || '',
  },
});

export const make_string_min_length_validator =
  (min_length: number): ValidatorFunction<string, unknown> =>
  (value) =>
    value.length < min_length
      ? {
          en: `The minimum length is ${min_length}. Current length is ${value.length}.`,
          fr: 'TODO',
        }
      : undefined;

export const make_string_max_length_validator =
  (max_length: number): ValidatorFunction<string, unknown> =>
  (value) =>
    value.length > max_length
      ? {
          en: `The maximum length is ${max_length}. Current length is ${value.length}.`,
          fr: 'TODO',
        }
      : undefined;

export const primary_key_type = {
  ...string_type_mixin,
  ...is_required_mixin,
  unique: true,
  index: true,
  immutable: true,
};
// This probably shouldn't be used outside of the case of optional subdocuments, but it IS required for subdocuments whenever
// the subdocument schema needs a primary_key but isn't itself a required field of the parent. If multiple parents ARE
// missing a subdocument which has a required unique index then the database will throw a "dup key: { : null }" error.
// The only solution is to not put unique indexes on the subdocuments or to make sure they're sparse.
export const primary_key_type_sparse = {
  ...string_type_mixin,
  unique: true,
  sparse: true,
};

type ForeignTypeOptions = {
  required?: boolean;
  index?: boolean;
};
const use_foreign_type_options = (
  options?: ForeignTypeOptions,
): (typeof is_required_mixin & { index: boolean }) | { sparse: boolean } =>
  options?.required
    ? { ...is_required_mixin, index: !!options?.index }
    : { sparse: !!options?.index };

export const make_foreign_key_type = <
  KeyType extends typeof String | typeof Number,
>(
  key_type: KeyType,
  _ref: string, // unused, require it to be declared for self-documentation
  options?: ForeignTypeOptions,
) => ({
  type: key_type,
  ...use_foreign_type_options(options),
});

export const make_foreign_id_type = (
  ref: string,
  options?: ForeignTypeOptions,
) => ({
  type: Schema.ObjectId,
  ref,
  ...use_foreign_type_options(options),
});

export const make_lang_suffixed_type = <Key extends string, MongooseType>(
  key: Key,
  type: MongooseType,
) =>
  Object.fromEntries(get_lang_suffixed_keys(key).map((key) => [key, type])) as {
    [k in LangSuffixedKeyUnion<Key>]: MongooseType;
  };
