'use client';

import { SearchIcon } from './SearchIcon';
import styles from './searchbar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function SearchBar({value, onChange, placeholder, disabled = false,}: SearchBarProps) {
  return (
    <div className={styles.wrapper}>
      <SearchIcon className={styles.icon} />

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={styles.input}
      />
    </div>
  );
}