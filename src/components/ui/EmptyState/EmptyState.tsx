import { Icon } from "../Icons/Icons";
import styles from "./emptystate.module.css";

type EmptyStateProps = {
  title: string;
  description?: string;
};

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.icon}>
        <Icon name="trash" />
      </div>

      <h3 className={styles.title}>{title}</h3>

      {description && (
        <p className={styles.description}>{description}</p>
      )}
    </div>
  );
}