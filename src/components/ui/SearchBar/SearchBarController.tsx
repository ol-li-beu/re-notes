'use client';

import { useState, useMemo } from 'react';
import SearchBar from './SearchBar';

interface Props<T> {
  items: T[];
  placeholder?: string;
  filterFn: (item: T, query: string) => boolean;
  children: (filtered: T[]) => React.ReactNode;
}

export default function SearchController<T>({
  items,
  placeholder,
  filterFn,
  children,
}: Props<T>) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => items.filter(item => filterFn(item, query)),
    [items, query, filterFn]
  );

  return (
    <>
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={placeholder}
      />

      {children(filtered)}
    </>
  );
}