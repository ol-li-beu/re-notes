import { ICONSTYPE, IconName } from "@/utils/types";
import styles from "./icons.module.css";




type Props = {
  name: IconName;
  onClick?: () => void;
  strokeWidth?: number;
};

export function Icon({ name, onClick, strokeWidth}: Props) {
  const Icon = ICONSTYPE[name];

  return (
    <Icon
      className={`${styles.icon} ${onClick ? styles.clickable : ""}`}
      onClick={onClick}
      aria-label={name}
      strokeWidth={strokeWidth}
    />
  );
}