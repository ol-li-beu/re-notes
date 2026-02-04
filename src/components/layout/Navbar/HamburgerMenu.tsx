"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icons/Icons";

import styles from "./hamburgermenu.module.css";

interface HamburgerProps {
    dict : any;
    lang : string;
} // NO navlink if expansion is needed

export default function HamburgerMenu({dict, lang} : HamburgerProps) {
  const [open, setOpen] = useState(false);

// ANTI SCROLLING PARENT
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        className={styles.burger}
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
                <li><a href={`/${lang}/about`}className={styles.button}> {dict.about} </a></li>
                <li><a href={`/${lang}/learn`}className={styles.button}> {dict.learn} </a></li>
                <li><a href={`/${lang}/projects`}className={styles.button}> {dict.projects} </a></li>
            </ul>

          </nav>
        </>
      )}
    </>
  );
}