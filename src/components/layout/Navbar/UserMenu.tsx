"use client";

import { useState, useRef, useEffect, useContext } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal/ConfirmModal";
import { ToastContext } from "@/hooks/ToastContext";
import { Icon } from "@/components/ui/Icons/Icons";
import styles from "./usermenu.module.css";

interface UserDropdownProps {
  username: string;
  email: string;
  dict: any;
}

export default function UserMenu({ username, email, dict }: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false); // modal
  const { showToast } = useContext(ToastContext)!;
  
  const ref = useRef<HTMLDivElement>(null);

  // click
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
    <>
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
        {/*<button className={styles.item}> */}
            {/*<Icon name="mail"/> {email} </button> */}
          <button className={styles.item}> 
            <Icon name="logout"/> {dict.logout} </button>
          <button className={`${styles.item} ${styles.danger}`}
            onClick={() => {
            setConfirmDelete(true);
            setOpen(false); }}>
            <Icon name="trash"/>
            {dict.delete}
          </button>
        </div>
      )}
    </div>

    {confirmDelete && (
        <ConfirmModal
          title={dict.confirmtitle}
          description={dict.confirmdescription}
          btncancel={dict.confirmcancel}
          btnconfirm={dict.confirmdelete}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => {
            setConfirmDelete(false);
            // TODO: delete account SUpabse TBD, and close sesssion
          }}
        />
      )}
    </>

    
  );
}