import type { ValidatorFunction } from './validation_utils.ts';

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
