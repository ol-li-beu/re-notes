import { ICONSTYPE, IconName } from "@/utils/types";
import styles from "./icons.module.css";




type Props = {
  name: IconName;
  size?: number;
  onClick?: () => void;
};

export function Icon({ name, size = 18, onClick }: Props) {
  const LucideIcon = ICONSTYPE[name];

  return (
    <LucideIcon
      size={size}
      className={`${styles.icon} ${onClick ? styles.clickable : ""}`}
      onClick={onClick}
      aria-label={name}
    />
  );
}