import { getDictionary } from "@/utils/get-dictionary";
import { createClient } from "@/utils/supabase/server"; // <--- 1. Importar cliente Server
import Navbar from "@/components/layout/Navbar/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";
import "@/app/globals.css";

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
        {/* Pasamos el usuario real (o null) al Navbar */}
        <Navbar lang={lang} dict={dictionary} user={user} />
        
        <main className="flex-grow"> 
            {children} 
        </main>
        
        <Footer dict={dictionary} />
    </>
  );
}