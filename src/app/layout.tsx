
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


export const metadata = {
  title: 'Re-Notes',
  description: 'Recursive and dynamic blocks-based notepad',
  icons: {
    icon: '/favicon.png', 
  },
}


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