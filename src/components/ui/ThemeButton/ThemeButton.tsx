'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import styles from './themebutton.module.css'

export default function ThemeButton() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div style={{ width: 36, height: 36 }} />

  const isDark = theme === 'dark'

  return (
    <button
      aria-label="Toggle theme"
      className={styles.button}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <Sun className={`${styles.icon} ${styles.sun} ${isDark ? styles.hidden : styles.visible}`} />
      <Moon className={`${styles.icon} ${styles.moon} ${isDark ? styles.visible : styles.hidden}`} />
    </button>
  )
}