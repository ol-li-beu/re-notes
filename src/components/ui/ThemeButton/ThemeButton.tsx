'use client'

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import styles from './themebutton.module.css';

export default function ThemeButton() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // For setting initial mount 
  useEffect(() => {
    setMounted(true);
  }, []); 
  if (!mounted) return <div style={{ width: '35px', height: '35px' }} />;

  const isDark = theme === 'dark';
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <label className={styles.container} aria-label="Toggle Theme">
      <input 
        type="checkbox" 
        className={styles.checkbox} 
        checked={isDark}
        onChange={toggleTheme} 
      />
      <div className={styles.mainCircle}>
        <div className={styles.celestialBody}></div>
        <div className={styles.rays}>
          <span /> <span />
          <span /> <span />
          <span /> <span />
          <span /> <span />
        </div>
      </div>
    </label>
  );
}