
// for lib
const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
  es: () => import("@/dictionaries/es.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  const loader = dictionaries[locale as keyof typeof dictionaries] || dictionaries.en;
  return loader();
}