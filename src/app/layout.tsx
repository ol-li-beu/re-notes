
import { ThemeProvider } from "next-themes";
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



export default async function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html className={`${inter.variable} ${merriweather.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children} 
        </ThemeProvider>
      </body>
    </html>
  );
}