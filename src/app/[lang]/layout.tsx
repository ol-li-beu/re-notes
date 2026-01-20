
import { getDictionary } from "@/utils/get-dictionary";

import { getAuthUser } from "@/utils/auth-actions"; // TBD ELIMINATE, TEMPORARY 

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
  const user = await getAuthUser(); //TBD Supabase built-in authentication from session that is set in log in

  return (
    <>
            <Navbar lang = {lang} dict={dictionary} user={user} />
            <main className="flex-grow"> 
                {children} 
            </main>
            <Footer dict={dictionary} />
    </>
  );
}