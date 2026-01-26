"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";
import RectangularLogo from "@/components/ui/RectangularLogo/RectangularLogo";
import ThemeButton from "@/components/ui/ThemeButton/ThemeButton";
import LanguageSelector from "@/components/ui/LanguageSelector/LanguageSelector";
import UserMenu from "./UserMenu";


interface NavbarClientProps {
    lang : string;
    navLinks : any;
    user : any;
    dict: any;
}
export default function NavbarClient({
  lang,
  navLinks,
  user,
  dict,
} : NavbarClientProps) {
  const pathname = usePathname();
  const isLoggedIn = !!user;

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>

        {/* Left */}
        <div className={styles.left}>
          <RectangularLogo type="header" />
        </div>

        {/* Middle */}
        <div className={styles.middle}>
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
          <ThemeButton />
          <LanguageSelector currentLang={lang} />

          {isLoggedIn ? (
              <UserMenu username={user.name ?? "User"} email={user.email ?? "email@gmail.com"} dict={dict} />
          ) : (
            <div className={styles.authButtons}>
              <Link href={`/${lang}/login`} className={styles.loginBtn}>
                {dict.login}
              </Link>
              <Link href={`/${lang}/register`} className={styles.registerBtn}>
                {dict.register}
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}