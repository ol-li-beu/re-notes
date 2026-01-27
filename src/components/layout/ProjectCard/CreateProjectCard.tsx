"use client";

import styles from "./projectcard.module.css";

interface CreateProjectCardProps {
  onCreate: () => void;
}

export default function CreateProjectCard({ onCreate }: CreateProjectCardProps) {
  return (
    <div className={styles.card} onClick={onCreate}>
      <div className={styles.plusWrapper}>
        <span className={styles.plus}>+</span>
      </div>
      <p className={styles.createText}>Create Project</p>
    </div>
  );
}