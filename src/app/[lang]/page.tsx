import Link from "next/link";
import SquaredLogo from "@/components/ui/SquaredLogo/SquaredLogo";
import styles from "./mainpage.module.css";
import { getDictionary } from "@/utils/get-dictionary";


interface PageProps {
  params: {
    lang: string;
  };
}

export default async function HomePage({params} : PageProps) {
  const {lang} = await params;
  const dict = await getDictionary(lang);


  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.left}>
          <h1 className={styles.softwareName}>Re-Notes</h1>
          <p className={styles.description}>
            {dict.home.description}
          </p>
          <div className={styles.actions}>
            <Link href="" className={`${styles.btn} ${styles.ghost}`}>{dict.home.btnlearn}</Link>
            <Link href="" className={`${styles.btn} ${styles.primary}`}>{dict.home.btnregister}</Link>
          </div>
        </div>

        <div className={styles.logoContainer}>
          <SquaredLogo />
        </div>
      </header>


       <div className={styles.greySection}>

      </div>

    </main>
  );
}