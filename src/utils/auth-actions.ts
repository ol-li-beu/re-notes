'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

// ------------------------------------------------------------------
// 1. REGISTRO
// ------------------------------------------------------------------
export async function handleRegister(lang: string, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('username') as string 

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return redirect(`/${lang}/register?error=${encodeURIComponent(error.message)}`)
  }

  return redirect(`/${lang}/projects`)
}

// ------------------------------------------------------------------
// 2. LOGIN
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
// 3. OBTENER USUARIO
// ------------------------------------------------------------------
export async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user;
}

// ------------------------------------------------------------------
// 4. LOGOUT (NUCLEAR - Borra cookies a la fuerza)
// ------------------------------------------------------------------
export async function logout(lang: string) {
  const supabase = await createClient()
  
  // 1. Intentamos el logout oficial
  await supabase.auth.signOut()

  // 2. FUERZA BRUTA: Borramos las cookies manualmente
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  
  allCookies.forEach((cookie) => {
    // Las cookies de Supabase suelen empezar con 'sb-'
    if (cookie.name.startsWith('sb-')) {
      cookieStore.delete(cookie.name)
    }
  })

  // 3. Limpiamos la caché
  revalidatePath('/', 'layout')
  revalidatePath(`/${lang}`, 'layout')

  // 4. Redirigir
  redirect(`/${lang}/login`)
}