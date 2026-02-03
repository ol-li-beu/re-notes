import styles from "./spinner.module.css";

type SpinnerProps = {
  size?: number;
};

export default function Spinner({ size = 50 }: SpinnerProps) {
  return (
    <span
    role="status"
    aria-live="polite"
    aria-label="Loading"
      className={styles.spinner}
      style={{ width: size, height: size }}
    />
  );
}