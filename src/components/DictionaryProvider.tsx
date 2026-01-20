"use client"

import { createContext, useContext } from "react";

// Creating context. Client components only
// 
const DictionaryContext = createContext<any>(null);

export default function DictionaryProvider({ 
  children, 
  dictionary 
}: { 
  children: React.ReactNode; 
  dictionary: any; 
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}

// Custom Hook for "reading" the dictionary. 
export function useDictionary() {
  const context = useContext(DictionaryContext);
  if (context === null) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }
  return context;
}