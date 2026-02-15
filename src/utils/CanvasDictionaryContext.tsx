"use client";

import { createContext, useContext } from "react";

const DictionaryContext = createContext<any | null>(null);

export function CanvasDictionaryContext({
  dict,
  children,
}: {
  dict: any;
  children: React.ReactNode;
}) {
  return ( // In the future can make it more general or reusable
    <DictionaryContext.Provider value={dict.canvas}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const ctx = useContext(DictionaryContext);
  if (!ctx) throw new Error("useDictionary must be used inside  provider");
  return ctx;
}