"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icons/Icons";
import styles from "./usermenu.module.css";

interface GuestMenuProps {
  dict: any;
  lang: string;
}

export default function GuestMenu({ dict, lang }: GuestMenuProps) {
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
    <div ref={ref} className={styles.userMenu}>
      <button
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}>
        <Icon name="fingerprint" />
      </button>

      {open && (
        <div className={styles.dropdown}>
          <Link href={`/${lang}/login`} className={styles.item}>
            <Icon name="login" /> {dict.login}
          </Link>
          <Link href={`/${lang}/register`} className={styles.item}>
            <Icon name="userplus" /> {dict.register}
          </Link>
        </div>
      )}
    </div>
  );
}