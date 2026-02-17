"use client";

import { useEffect } from "react";
import styles from "./sidebar.module.css";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Sidebar({ open, onClose, children }: SidebarProps) {

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  
  return (
    <div
      className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
      onClick={onClose}
    >
      <aside
        className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.content}>
          {children}
        </div>
      </aside>
    </div>
  );
}
