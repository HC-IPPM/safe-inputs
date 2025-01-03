import type { Writable, ArraySlice, ArraySplice } from 'type-fest';

export const langs = ['en', 'fr'] as const;

export type LangsTuple = Writable<typeof langs>;
export type LangsUnion = LangsTuple[number];

type TupleTail<Tuple extends unknown[]> = ArraySlice<Tuple, 1>;

type TupleConcat<
  TupleA extends unknown[],
  TupleB extends unknown[],
> = ArraySplice<TupleA, TupleA['length'], 0, TupleB>;

type LangSuffixedKeyTupleRecursiveBuilder<
  Key extends string,
  LangsLeftToMap extends unknown[] = LangsTuple,
  Accumulator extends unknown[] = [],
> = {
  true: Accumulator;
  // Note: possibly borderline close to triggering a TS2589 "type instation is excessively deep" error,
  // might occur if further complexity is introduced under the hood in type-fest. Remidiation may require
  // looking for ways to simplify what we control, or replacing ArraySlice/ArraySplice with simpler implementations
  false: LangSuffixedKeyTupleRecursiveBuilder<
    Key,
    TupleTail<LangsLeftToMap>,
    TupleConcat<
      Accumulator,
      [`${Key}_${LangsLeftToMap[0] extends string ? LangsLeftToMap[0] : never}`]
    >
  >;
}[LangsLeftToMap['length'] extends 0 ? 'true' : 'false'];

export type LangSuffixedKeyTuple<Key extends string> =
  LangSuffixedKeyTupleRecursiveBuilder<Key>;
export type LangSuffixedKeyUnion<Key extends string> =
  LangSuffixedKeyTuple<Key>[number];

export const get_lang_suffixed_keys = <Key extends string>(key: Key) =>
  langs.map((lang) => `${key}_${lang}`) as unknown as LangSuffixedKeyTuple<Key>;
