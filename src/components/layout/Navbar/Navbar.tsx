"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './navbar.module.css';
import RectangularLogo from '@/components/ui/RectangularLogo/RectangularLogo';
import ThemeButton from '@/components/ui/ThemeButton/ThemeButton';
import { useDictionary } from '@/components/DictionaryProvider';
import LanguageSelector from '@/components/ui/LanguageSelector/LanguageSelector';


interface NavbarProps {
  lang: string;
  user: any; // TBD user type interface for protection
}

export default function Navbar({ lang, user }: NavbarProps) {
  const pathname = usePathname();
  const isLoggedIn = !!user;
  const dict = useDictionary();

  const navLinks = [
    { name: dict.navbar.about, href: `/${lang}/about` },
    { name: dict.navbar.learn, href: `/${lang}/learn` },
    { name: dict.navbar.projects, href: `/${lang}/projects` },
  ];



  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {/* Left: Logo */}
        <div className={styles.left}>
          <RectangularLogo type="header" />
        </div>

        {/* Middle: Links */}
        <div className={styles.middle}>
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={pathname === link.href ? styles.active : ""}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: User / Auth & Theme */}
        <div className={styles.right}>
            <ThemeButton></ThemeButton>
            <LanguageSelector currentLang={lang}></LanguageSelector>
          {isLoggedIn ? (
            <div className={styles.userProfile}>
              <span className={styles.userName}>{user.name}</span>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link href={`/${lang}/login`} className={styles.loginBtn}> {dict.navbar.login} </Link>
              <Link href={`/${lang}/register`} className={styles.registerBtn}> {dict.navbar.register} </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}