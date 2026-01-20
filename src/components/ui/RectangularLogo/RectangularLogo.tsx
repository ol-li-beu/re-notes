"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './rectangularlogo.module.css';


interface RectangularLogoProps {
  type: "header" | "footer"
}

export default function RectangularLogo({type} : RectangularLogoProps) {
  const params = useParams();
  
  const lang = params?.lang || 'en';
  

  return (
    <Link href={`/${lang}`} className={styles.rectangularlogo}>
      <div className={`${styles.logoIcon} ${type === 'header' ? styles.header : styles.footer}`} />
    </Link>
  );
}
// priority for LCP (largest colorful paint)