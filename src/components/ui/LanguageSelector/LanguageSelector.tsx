'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getRedirectedPathname } from '../../../utils/i18n';
import styles from './languageselector.module.css';

const langs = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
];

export default function LanguageSelector({ currentLang }: { currentLang: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const handleSwitch = (lang: string) => {
    const newPath = getRedirectedPathname(pathname, lang);
    router.push(newPath);
    setOpen(false);
  };

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = langs.find(l => l.value === currentLang);

  return (
    <div className={styles.selectContainer} ref={ref}>
      <button
        className={styles.trigger}
        onClick={() => setOpen(v => !v)}
        aria-label="Change language"
      >
        {current?.label}
      </button>

      {open && (
        <div className={styles.dropdown}>
          {langs.map(l => (
            <button
              key={l.value}
              className={`${styles.option} ${l.value === currentLang ? styles.active : ''}`}
              onClick={() => handleSwitch(l.value)}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}