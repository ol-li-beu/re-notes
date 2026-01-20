
import { ThemeProvider } from "next-themes";
import DictionaryProvider from "@/components/DictionaryProvider";
import { getDictionary } from "@/utils/get-dictionary";

import { getAuthUser } from "@/utils/auth-user";
import Navbar from "@/components/layout/Navbar/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";

import { Inter, Merriweather } from 'next/font/google';
import "@/app/globals.css";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans', 
});

const merriweather = Merriweather({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif', 
});

interface LayoutProps {
  children : React.ReactNode;
  params : Promise<{lang : string }>;
}

export default async function RootLayout({children, params} : LayoutProps) {
  // resolving lang 
  const { lang } = await params;

  const dictionary = await getDictionary(lang as any);

  const user = await getAuthUser();

  return (
    // suppressHydrationWarning for next-themes
    <html lang={lang} className={`${inter.variable} ${merriweather.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <DictionaryProvider dictionary={dictionary}> 

            <Navbar lang={lang} user={user} />
            <main className="flex-grow"> 
                {children} 
            </main>
            <Footer />

          </DictionaryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}