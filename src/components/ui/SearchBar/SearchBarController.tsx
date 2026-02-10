'use client';

import { useState, useMemo } from 'react';
import SearchBar from './SearchBar';
import styles from './searchbarcontroller.module.css';

interface Props<T> {
  items: T[];
  placeholder?: string;
  filterFn: (item: T, query: string) => boolean;
  actions?: React.ReactNode; 
  children: (filtered: T[]) => React.ReactNode;
}

export default function SearchController<T>({
  items,
  placeholder,
  filterFn,
  actions,
  children,
}: Props<T>) {
  const [query, setQuery] = useState(''); // persist

  const filtered = useMemo(
    () => items.filter(item => filterFn(item, query)),
    [items, query, filterFn]
  ); 
  // useMemo for better performance, only on change

  // reusable searchBar component with filtering functionality via input queries

  return (
    <>
      <div className={styles.header}>
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={placeholder}
        />

        {actions && (
          <div className={styles.actions}>
            {actions}
          </div>
        )}
      </div>

      {children(filtered)}
    </>
  );
}