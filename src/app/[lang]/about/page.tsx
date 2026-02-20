import StaticSquaredLogo from "@/components/ui/SquaredLogo/StaticSquaredLogo";
import styles from "./about.module.css";
import { Icon } from "@/components/ui/Icons/Icons";

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>

        <h1 className={`${styles.title} ${styles.animateFadeUp}`} style={{ animationDelay: "0ms" }}>
          Sobre Nosotros
        </h1>

        <div className={`${styles.body} ${styles.animateFadeUp}`} style={{ animationDelay: "120ms" }}>
          <p>Re-Notes nació de querer tomar notas sin tener la necesidad de pensar en formato primero. El espacio horizontal para conectar y agrupar en un mismo canvas, vertical para redirigirte a un subespacio si una idea necesita su propio lugar.</p>
          <p>Sin estructura predefinida. La jerarquía la construís vos, cuando y como la necesitás.</p>
        </div>

        <div className={`${styles.pillRow} ${styles.animateFadeUp}`} style={{ animationDelay: "240ms" }}>
          <span className={styles.pill}> <Icon name="nextjs" /> Next.js </span>
          <span className={styles.pill}> <Icon name="reactflow" /> React Flow </span>
          <span className={styles.pill}> <Icon name="supabase" /> Supabase </span>
          <span className={styles.pill}> <Icon name="typescript" /> TypeScript </span>
        </div>
        
        <div className={`${styles.animateFadeUp}`} style={{ animationDelay: "360ms" }}>
          <StaticSquaredLogo size="clamp(70px, 15vw, 120px)" />
        </div>

      </section>
    </main>
  );
}