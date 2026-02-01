import { ICONSTYPE, IconName } from "@/utils/types";
import styles from "./icons.module.css";




type Props = {
  name: IconName;
  size?: number;
  onClick?: () => void;
};

export function Icon({ name, size = 18, onClick }: Props) {
  const Icon = ICONSTYPE[name];

  return (
    <Icon
      size={size}
      className={`${styles.icon} ${onClick ? styles.clickable : ""}`}
      onClick={onClick}
      aria-label={name}
    />
  );
}