"use client";

import { useState, useRef, useEffect, useContext } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal/ConfirmModal";
import { ToastContext } from "@/hooks/ToastContext";
import { Icon } from "@/components/ui/Icons/Icons";
import { useRouter } from "next/navigation";
import styles from "./usermenu.module.css";

interface UserDropdownProps {
  username: string;
  email: string;
  dict: any;
  lang : string;
}

export default function UserMenu({ username, email, dict, lang }: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();

  const { showToast } = useContext(ToastContext)!;
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

  // 5-second cooldown when modal CONFIRM DELETE opens
  useEffect(() => {
    if (!confirmDelete) return;

    setCooldown(5); 
    const timer = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [confirmDelete]);

  const handleDeleteAccount = async () => {
    if (deleting || cooldown > 0) return;

    setDeleting(true);
    try {
      // TODO: reemplazar con eliminar cuenta supabse y cerrar sesion
      await new Promise((res) => setTimeout(res, 1500));

      showToast(dict.accountdeleted, "error");
      setConfirmDelete(false);

    } catch (err) {
      showToast(dict.error, "error");
    } finally {
      setDeleting(false);
      router.push(`/${lang}`);
    }
  };

  const handleLogOut = async () => {
    try {
      //cerrar sesion supabse TODO
    } catch (err) {
      showToast(dict.error, "error");
    } finally {
      showToast(dict.logoutsuccess, "success")
      router.push(`/${lang}`)
    }
  } 

  return (
    <>
      <div ref={ref} className={styles.userMenu}>
        <button
          onClick={() => setOpen((v) => !v)}
          className={styles.trigger}
          aria-expanded={open}
        >
          <Icon name="user" /> {username}
          <span className={`${styles.arrow} ${open ? styles.open : ""}`}>▾</span>
        </button>

        {open && (
          <div className={styles.dropdown}>
            <button className={`${styles.item} ${styles.emailItem}`}>
              <Icon name="mail" />{email}
            </button>
            <button className={styles.item} onClick={handleLogOut}>
              <Icon name="logout" /> {dict.logout}
            </button>
            <button
              className={`${styles.item} ${styles.danger}`}
              onClick={() => {
                setConfirmDelete(true);
                setOpen(false);
              }}
            >
              <Icon name="trash" /> {dict.delete}
            </button>
          </div>
        )}
      </div>

      {confirmDelete && (
        <ConfirmModal
          title={dict.confirmtitle}
          description={dict.confirmdescription}
          btncancel={dict.confirmcancel}
          btnconfirm={
            cooldown > 0 ? `${dict.deletein} ${cooldown}s` : dict.confirmdelete
          }
          onCancel={() => setConfirmDelete(false)}
          onConfirm={handleDeleteAccount}
          disabled={deleting || cooldown > 0} 
        />
      )}
    </>
  );
}