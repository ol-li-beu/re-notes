'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// ------------------------------------------------------------------
// 1. REGISTRO (Antes: handleRegister)
// ------------------------------------------------------------------
// Nota: Asumimos que usas .bind(null, lang) en el formulario, 
// por eso 'lang' llega primero.
export async function handleRegister(lang: string, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('username') as string 

  // Enviamos a Supabase
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName, // Esto activa tu trigger de SQL
      },
    },
  })

  if (error) {
    return redirect(`/${lang}/register?error=${encodeURIComponent(error.message)}`)
  }

  return redirect(`/${lang}/projects`)
}

// ------------------------------------------------------------------
// 2. LOGIN (Antes: handleLogin)
// ------------------------------------------------------------------
export async function handleLogin(lang: string, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect(`/${lang}/login?error=Credenciales inválidas`)
  }

  return redirect(`/${lang}/projects`)
}

// ------------------------------------------------------------------
// 3. OBTENER USUARIO (Antes: getAuthUser)
// ------------------------------------------------------------------
// Restauramos esta función para que tu Layout/Navbar no se rompa
export async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user;
}

// ------------------------------------------------------------------
// 4. LOGOUT
// ------------------------------------------------------------------
export async function logout(lang: string) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect(`/${lang}/login`)
}
/*
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
}*/