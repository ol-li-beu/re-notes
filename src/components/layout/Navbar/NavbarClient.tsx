"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import RectangularLogo from "@/components/ui/RectangularLogo/RectangularLogo";
import ThemeButton from "@/components/ui/ThemeButton/ThemeButton";
import LanguageSelector from "@/components/ui/LanguageSelector/LanguageSelector";
import UserMenu from "./UserMenu";
import { Icon } from "@/components/ui/Icons/Icons";

import styles from "./navbar.module.css";
import HamburgerMenu from "./HamburgerMenu";


interface NavbarClientProps {
    lang : string;
    navLinks : any;
    user : any;
    dict: any;
}
export default function NavbarClient({ lang, navLinks, user, dict, } : NavbarClientProps) {
  const pathname = usePathname();
  const isLoggedIn = !!user;

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>

        {/* Left */}
        <div className={styles.left}>
          <div className={styles.mobileOnlyGuestMenu}>
            <HamburgerMenu dict={dict} lang={lang} />
          </div>
          <RectangularLogo type="header" />   
        </div>

        {/* Middle */}
        <div className={`${styles.middle}`}>
          {navLinks.map((link : any) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? styles.active : ""}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className={styles.right}>
          

          {isLoggedIn ? ( <>
              <ThemeButton />
              <LanguageSelector currentLang={lang} />
              <UserMenu username={user.name ?? "User"} email={user.email ?? "email@gmail.com"} dict={dict} lang={lang} />
              </>
          ) : (
              <div className={styles.authButtons}>
                <Link href={`/${lang}/login`} className={styles.loginBtn}>
                  <Icon name="login" /> {dict.login}
                </Link>
                <Link href={`/${lang}/register`} className={styles.registerBtn}>
                  <Icon name="userplus" /> {dict.register}
                </Link>
              </div>
          )}
        </div>

      </div>
    </nav>
  );
}