import { ICONSTYPE, IconName } from "@/utils/types";
import styles from "./icons.module.css";




type Props = {
  name: IconName;
  onClick?: () => void;
};

export function Icon({ name, onClick }: Props) {
  const Icon = ICONSTYPE[name];

  return (
    <Icon
      className={`${styles.icon} ${onClick ? styles.clickable : ""}`}
      onClick={onClick}
      aria-label={name}
    />
  );
}