"use client";
import { IconName } from "@/utils/types";
import { Icon } from "@/components/ui/Icons/Icons";
import styles from "./projectcard.module.css";

interface SpecialProjectCardProps {
  onClick: () => void;
  title: string;
  iconName: IconName;
}

export default function SpecialProjectCard({ onClick, title, iconName}: SpecialProjectCardProps) {
  return (
    <div className={`${styles.card} ${styles.specialCard}`} onClick={onClick}>
      <p className={styles.specialText}>{title}</p>
      <div className={styles.iconWrapper}> 
        <span className={styles.specialIcon}> <Icon name={iconName}/> </span>
      </div>
    </div>
  );
}