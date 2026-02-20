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
  const [closing, setClosing] = useState(false);
  const pathname = usePathname();

  const navLinks = dict ? [
    { name: dict.about, href: `/${lang}/about` },
    { name: dict.learn, href: `/${lang}/learn` },
    { name: dict.projects, href: `/${lang}/projects` },
  ] : [];

  useLockBodyScroll(open);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setOpen(false);
    }, 200);
  };
  
  return (
    <>
      <button
        className={`${styles.burger}`}
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        >
            <Icon name="menu" />
      </button>

      {(open || closing) && (
        <>
          <div
            className={styles.overlay}
            onClick={handleClose}/>

          {/* Side menu */}
          <nav className={`${styles.menu} ${closing ? styles.menuClosing : ""}`}>
            <div>
             <button
              className={`${styles.close}`}
              onClick={handleClose}
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