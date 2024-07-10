export const langs = ['en', 'fr'] as const;

export type LangsTupple = typeof langs;
export type LangsUnion = LangsTupple[number];

export type BilingualKeyTupple<Key extends string> = [
  `${Key}_${LangsTupple[number]}`,
];
export type BilingualKeyUnion<Key extends string> =
  BilingualKeyTupple<Key>[number];

export const get_bilingual_keys = <Key extends string>(key: Key) =>
  langs.map((lang) => `${key}_${lang}`) as unknown as BilingualKeyTupple<Key>;
