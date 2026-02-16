import styles from "./toolbar.module.css";

type Props = {
  children: React.ReactNode;
};

export default function Toolbar({ children }: Props) {
  return <div className={styles.toolbar}>{children}</div>;
}