"use client";

import { useEffect } from "react";
import styles from "./confirmmodal.module.css";

export default function ConfirmModal({title, description, btncancel, btnconfirm,  
  onConfirm, onCancel, disabled=false,}: 
  {title: string; description: string; btncancel : string; btnconfirm : string; 
  onConfirm: () => void; onCancel: () => void; disabled?: boolean}) {
  

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{title}</h3>
        {description && <p>{description}</p>}

        <div className={styles.actions}>
          <button onClick={onCancel}>
            {btncancel}
          </button>
          <button className={styles.danger} onClick={onConfirm} disabled={disabled}>
            {btnconfirm}
          </button>
        </div>
      </div>
    </div>
  );
}