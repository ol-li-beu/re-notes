"use client";
import { IconName } from "@/utils/types";
import { Icon } from "@/components/ui/Icons/Icons";
import styles from "./projectcard.module.css";

interface SpecialProjectCardProps {
  onClick: () => void;
  title: string;
  iconName: IconName;
  size? : number;
}

export default function SpecialProjectCard({ onClick, title, iconName, size=40}: SpecialProjectCardProps) {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.iconWrapper}> {/* TBD */}
        <span className={styles.specialIcon}> <Icon name={iconName} size={size} /> </span>
      </div>
      <p className={styles.specialText}>{title}</p>
    </div>
  );
}