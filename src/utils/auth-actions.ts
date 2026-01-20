'use server'

// for lib, just structure
// could expand with 2fa

import { redirect } from 'next/navigation'

// session and log in automatic

export async function handleRegister(formData: FormData, lang: string = 'en') {
  const password = formData.get("password") as string;

  //TBD supabase built-in, error if fails register
  
  redirect(`/${lang}/login`);
}

  

export async function handleLogin(formData: FormData, lang: string = 'en') {
    const password = formData.get("password") as string;
    
    // supabase built-in, error if fails log in 

    redirect(`/${lang}/projects`);
}


// HANDLE LOG OUT AUTOMATIC?

export async function logout(lang: string = 'en') {
  redirect(`/${lang}`) // Redirect to "home" page
}

// USER AUTH AUTOM

export async function getAuthUser() { // TEMPORARY FOR LAYOUT
  return null;
}