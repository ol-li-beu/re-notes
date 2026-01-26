"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./usermenu.module.css";

interface UserDropdownProps {
  username: string;
  email: string;
  dict: any;
}

export default function UserMenu({ username, email, dict }: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={styles.wrapper}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={styles.trigger}
        aria-expanded={open}>
        {username}
        <span className={`${styles.arrow} ${open ? styles.open : ""}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className={styles.dropdown}>
        <button className={styles.item}> {email} </button>
          <button className={styles.item}> {dict.logout} </button>
          <button className={`${styles.item} ${styles.danger}`}>
            {dict.delete}
          </button>
        </div>
      )}
    </div>
  );
}