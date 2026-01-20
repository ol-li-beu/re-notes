export const langs = ['en', 'es'] as const;
export const defaultLang = 'en';

export type Lang = (typeof langs)[number];