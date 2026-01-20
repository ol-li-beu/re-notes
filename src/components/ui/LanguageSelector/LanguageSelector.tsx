'use client';

import { usePathname, useRouter } from 'next/navigation';
import { getRedirectedPathname } from '../../../utils/i18n'; 
import styles from './languageselector.module.css'; 

export default function LanguageSelector({ currentLang }: { currentLang: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSwitch = (lang: string) => {
    const newPath = getRedirectedPathname(pathname, lang);
    router.push(newPath); 
  };

  return (
    <div className={styles.selectContainer}>
      <select 
        className={styles.select}
        value={currentLang} 
        onChange={(e) => handleSwitch(e.target.value)}
        aria-label="Change language"
      >
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </div>
  );
}