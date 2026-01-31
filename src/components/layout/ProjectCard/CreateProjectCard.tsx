"use client";

import styles from "./projectcard.module.css";

interface CreateProjectCardProps {
  onCreate: () => void;
  title: string;
}

export default function CreateProjectCard({ onCreate, title }: CreateProjectCardProps) {
  return (
    <div className={styles.card} onClick={onCreate}>
      <div className={styles.plusWrapper}>
        <span className={styles.plus}>+</span>
      </div>
      <p className={styles.createText}>{title}</p>
    </div>
  );
}