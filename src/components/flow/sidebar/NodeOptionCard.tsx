
import styles from "./nodeoptioncard.module.css";

type NodeOptionCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
};

export function NodeOptionCard({ icon, title, description, onClick }: NodeOptionCardProps) {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.text}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}
