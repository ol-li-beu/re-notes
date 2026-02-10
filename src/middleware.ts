import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // --- DEBUG LOGS (Borrar luego) ---
  console.log(`🔒 Middleware revisando ruta: ${request.nextUrl.pathname}`)

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // LOG PARA VER SI DETECTA USUARIO
  if (user) {
    console.log("✅ Usuario detectado:", user.email)
  } else {
    console.log("❌ No hay usuario")
  }

  // REGLA DE SEGURIDAD
  if (!user && request.nextUrl.pathname.includes('/projects')) {
    console.log("⛔ Acceso denegado. Redirigiendo a login.")
    const url = request.nextUrl.clone()
    url.pathname = '/es/login' // Forzamos español por defecto si falta
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}