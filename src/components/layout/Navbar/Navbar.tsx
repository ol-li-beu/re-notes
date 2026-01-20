import NavbarClient from './NavbarClient';


interface NavbarProps {
  lang: string;
  dict: any;
  user: any; // TBD user type interface for protection
}

export default function Navbar({ lang, dict, user }: NavbarProps) {
  

  const navLinks = [
    { name: dict.navbar.about, href: `/${lang}/about` },
    { name: dict.navbar.learn, href: `/${lang}/learn` },
    { name: dict.navbar.projects, href: `/${lang}/projects` },
  ];

  return (
    <NavbarClient
      lang={lang}
      navLinks={navLinks}
      user={user}
      dict={dict.navbar}
    />
  );
}
