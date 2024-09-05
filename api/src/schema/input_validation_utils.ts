export const validate_string_input = (
  string: string | undefined,
  { is_required = true, min_length = 1, max_length = 400 } = {},
) => {
  if (typeof string === 'undefined') {
    if (!is_required) {
      throw new Error('Required');
    }
  } else {
    const min_length_ok = string.length >= min_length;
    const max_length_ok = string.length <= max_length;

    if (!(min_length_ok && max_length_ok)) {
      // TODO throw or return descriptive error messages?
    }
  }
};
