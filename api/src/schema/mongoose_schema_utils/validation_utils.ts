import _ from 'lodash';
import type { Model, ValidatorProps, SchemaValidator } from 'mongoose';
import { Error as MongooseError, HydratedDocument } from 'mongoose';

import type { PartialDeep } from 'type-fest';

import { langs } from 'src/schema/lang_utils.ts';
import type { LangsUnion } from 'src/schema/lang_utils.ts';

export type ValidationMessagesByLang = Record<LangsUnion, string>;

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

export type ValidatorFunction<SchemaDefType, ModelInterface> = (
  value: SchemaDefType,
  validation_props?: ValidatorProps,
  document?: HydratedDocument<ModelInterface> | ModelInterface,
) =>
  | undefined
  | ValidationMessagesByLang
  | Promise<undefined | ValidationMessagesByLang>;

export const make_validation_mixin = <SchemaDefType, ModelInterface>(
  ...validator_funcs: ValidatorFunction<SchemaDefType, ModelInterface>[]
): { validate: SchemaValidator<SchemaDefType, ModelInterface> } => ({
  validate: {
    propsParameter: true,
    validator: function (value: SchemaDefType, validation_props) {
      return Promise.all(
        validator_funcs.map((func) =>
          func(
            value,
            validation_props,
            this as HydratedDocument<ModelInterface> | ModelInterface,
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

export const get_validation_errors = async <ModelInterface>(
  Model: Model<ModelInterface>,
  input: PartialDeep<ModelInterface>,
  paths_to_validate: string[],
) => {
  try {
    // WARNING: where subdocument arrays exist (nested in the model schema itself, arrays of foreign id refs are fine)
    // mongoose validation doesn't distinguish between the subdocument source of a given error! This can totally ruin our
    // approach of defining user input validation rules at the schema validation level, as any sibling subdocuments in the DB
    // with existing errors will be spitting out their errors when we try to validate new sibling entries...
    // MUST discourage the use of subdocument arrays, normalize and use make_foreign_id_ref_schema_def instead. Ugh
    await Model.validate(new Model(input), paths_to_validate);

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

          interface ValidationMessagesByExpandedPath {
            [key_in_path: string]:
              | ValidationMessagesByExpandedPath
              | ValidationMessagesByLang;
          }

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
