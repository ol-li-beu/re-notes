
import { cache } from "react";


const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
  es: () => import("@/dictionaries/es.json").then((module) => module.default),
};

export const getDictionary = cache(async (locale: string) => {
  const loader = dictionaries[locale as keyof typeof dictionaries] || dictionaries.en;
  return loader();
})