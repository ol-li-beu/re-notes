"use client";

import { useState, useRef, useEffect, useContext } from "react";
// import { useRouter } from "next/navigation"; // Ya no es estrictamente necesario para logout, pero lo dejamos por si acaso
import { logout } from "@/utils/auth-actions"; // <--- 1. IMPORTAR LA ACCIÓN REAL

import ConfirmModal from "@/components/ui/ConfirmModal/ConfirmModal";
// Asegúrate de que la ruta de Icon sea correcta según tu proyecto
import { Icon } from "@/components/ui/Icons/Icons"; 

import { ToastContext } from "@/hooks/ToastContext";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

import styles from "./usermenu.module.css";

interface UserDropdownProps {
  username: string;
  email: string;
  dict: any;
  lang: string;
}

export default function UserMenu({ username, email, dict, lang }: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  
  // const router = useRouter(); // La acción de logout del servidor ya hace redirect
  const { showToast } = useContext(ToastContext)!;
  const ref = useRef<HTMLDivElement>(null);

  useLockBodyScroll(confirmDelete);

  // Click outside close handler
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  // 5-second cooldown logic
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
      // AQUÍ IRÁ TU LÓGICA DE BORRADO REAL MÁS ADELANTE
      await new Promise((res) => setTimeout(res, 1500));

      showToast(dict?.accountdeleted || "Cuenta eliminada", "error");
      setConfirmDelete(false);

    } catch (err) {
      showToast(dict?.error || "Error", "error");
    } finally {
      setDeleting(false);
      // router.push(`/${lang}`);
    }
  };

  // --- 2. FUNCIÓN LOGOUT INTEGRADA ---
  const handleLogOut = async () => {
    try {
      // Llamamos a la Server Action. 
      // Esta función borra cookies, invalida caché y redirige.
      await logout(lang); 
      
    } catch (err) {
      console.error(err);
      showToast(dict?.error || "Error al cerrar sesión", "error");
    } 
    // No necesitamos 'finally' con router.push porque logout() ya hace redirect en el servidor
  } 

  return (
    <>
      <div ref={ref} className={styles.userMenu}>
        <button
          onClick={() => setOpen((v) => !v)}
          className={`${styles.trigger}`} // Mantenemos tus clases
          aria-expanded={open}>
          <Icon name="user" />  
        </button>

        {open && (
          <div className={styles.dropdown}>
            {/* Items informativos */}
            <div className={`${styles.item} ${styles.dataItem}`} onClick={() => showToast("WIP", "success")}> 
              <Icon name="userpen" /> 
              <span className="truncate max-w-[150px]">{username}</span>
            </div>
            
            <div className={`${styles.item} ${styles.dataItem}`}>
              <Icon name="mail" /> 
              <span className="truncate max-w-[150px]">{email}</span>
            </div>

            <hr className="my-1 border-gray-200" />

            {/* BOTÓN LOGOUT REAL */}
            <button className={styles.item} onClick={handleLogOut}>
              <Icon name="logout" /> {dict?.logout || "Logout"}
            </button>

            {/* BOTÓN DELETE */}
            <button
              className={`${styles.item} ${styles.danger}`}
              onClick={() => {
                setConfirmDelete(true);
                setOpen(false);
              }}
            >
              <Icon name="userx" /> {dict?.delete || "Delete"}
            </button>
          </div>
        )}
      </div>

      {confirmDelete && (
        <ConfirmModal
          title={dict?.confirmtitle}
          description={dict?.confirmdescription}
          btncancel={dict?.confirmcancel}
          btnconfirm={
            cooldown > 0 ? `${dict?.deletein || "Wait"} ${cooldown}s` : (dict?.confirmdelete || "Delete")
          }
          onCancel={() => setConfirmDelete(false)}
          onConfirm={handleDeleteAccount}
          disabled={deleting || cooldown > 0} 
        />
      )}
    </>
  );
}