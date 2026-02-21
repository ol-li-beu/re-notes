import StaticSquaredLogo from "@/components/ui/SquaredLogo/StaticSquaredLogo";
import styles from "./about.module.css";
import { Icon } from "@/components/ui/Icons/Icons";
import { getDictionary } from "@/utils/get-dictionary";

interface PageProps {
  params: {
    lang: string;
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);

  return (
    <main className={styles.main}>
      <section className={styles.hero}>

        <h1 className={`${styles.title} ${styles.animateFadeUp}`} style={{ animationDelay: "0ms" }}>
          {dict.about.title}
        </h1>

        <div className={`${styles.body} ${styles.animateFadeUp}`} style={{ animationDelay: "120ms" }}>
          <p>{dict.about.intro1}</p>
          <p>{dict.about.intro2}</p>
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