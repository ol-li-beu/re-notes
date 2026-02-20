import styles from "./staticsquaredlogo.module.css";

type Props = {
  size?: number | string;
};

export default function StaticSquaredLogo({ size = 120 }: Props) {
  return (
    <div
      className={styles.wrapper}
      style={{ "--logo-size": typeof size === "number" ? `${size}px` : size } as React.CSSProperties}
    >
      <div className={styles.ring} />
      <div className={styles.logoIcon} />
    </div>
  );
}