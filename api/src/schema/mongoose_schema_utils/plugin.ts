import { Schema } from 'mongoose';

import uniqueValidator from 'mongoose-unique-validator';

import { validation_messages_by_lang_to_error_string } from './validation_utils.ts';

export const with_uniqueness_validation_plugin = <ModelInterface>(
  schema: Schema<ModelInterface>,
) => {
  return schema.plugin(uniqueValidator, {
    message: ({ value }: { value: string }) =>
      validation_messages_by_lang_to_error_string({
        en: `Must be unique. Value "${value}" is already in use.`,
        fr: 'TODO',
      }),
  });
};
