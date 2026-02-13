import { getDictionary } from "@/utils/get-dictionary";
import { createClient } from "@/utils/supabase/server"; // <--- 1. Importar cliente Server
import Navbar from "@/components/layout/Navbar/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";
import "@/app/globals.css";7
import styles from "./mainpage.module.css";

interface LayoutProps {
  children : React.ReactNode;
  params : Promise<{lang : string }>;
}

export default async function LangLayout({children, params} : LayoutProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as any);

  // 2. OBTENER EL USUARIO REAL (Server Side)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // El objeto 'user' ahora contiene todo: email, id, user_metadata, etc.
  // Si no está logueado, 'user' será null.

  return (
    <>
      <div className={styles.pagewrapper} >
        {/* Pasamos el usuario real (o null) al Navbar */}
        
        <Navbar lang={lang} dict={dictionary} user={user} />
        
        <main className={styles.mainlayout}> 
            {children} 
        </main>
      </div>

      <Footer dict={dictionary} />
    </>
  );
}