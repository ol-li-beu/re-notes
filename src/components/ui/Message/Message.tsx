"use client";

import styles from "./message.module.css";

interface MessageProps {
  type: "error" | "success" | "info";
  children: React.ReactNode;
  onClose?: () => void;
}

export default function Message({ type, children, onClose }: MessageProps) {
  return (
    <div className={`${styles.message} ${styles[type]}`}>
      <span>{children}</span>
      {onClose && (
        <button className={styles.close} onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
}