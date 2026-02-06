"use client";

import { useEffect, useState } from "react";
import { usePathname, } from "next/navigation";
import Link from "next/link";

import { Icon } from "@/components/ui/Icons/Icons";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

import styles from "./hamburgermenu.module.css";

interface HamburgerProps {
    dict : any;
    lang : string;
} 

export default function HamburgerMenu({dict, lang} : HamburgerProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = dict ? [
    { name: dict.about, href: `/${lang}/about` },
    { name: dict.learn, href: `/${lang}/learn` },
    { name: dict.projects, href: `/${lang}/projects` },
  ] : [];

  useLockBodyScroll(open);
  
  return (
    <>
      <button
        className={`circle-fill ${styles.burger}`}
        onClick={() => setOpen(true)}
        aria-label="Open menu">
            <Icon name="menu" />
      </button>

      {open && (
        <>
          <div
            className={styles.overlay}
            onClick={() => setOpen(false)}/>

          {/* Side menu */}
          <nav className={styles.menu}>

            <div className="circle-fill">
            <button
              className={`${styles.close}`}
              onClick={() => setOpen(false)}
              aria-label="Close menu">
              ✕
            </button>
            </div>

            <ul>
            {navLinks.map((link : any) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`${styles.button} ${isActive ? styles.active : ""}`}
                      onClick={() => setOpen(false)} >
                      {link.name}
                    </Link>
                  </li>
                );
                })}
            </ul>

          </nav>
        </>
      )}
    </>
  );
}