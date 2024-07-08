import type { LangsUnion, BilingualKeyUnion } from './lang_utils.ts';

export const resolve_bilingual_scalar =
  <Key extends string>(base_field_name: Key) =>
  <ParentType extends { [k in BilingualKeyUnion<Key>]: any }>(
    parent: ParentType,
    _args: unknown,
    context: { lang: LangsUnion },
  ) =>
    parent[`${base_field_name}_${context.lang}`];
