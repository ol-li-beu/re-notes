import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { langs, defaultLang } from "../utils/i18n-config";



export async function middleware(request : NextRequest) {
    const { pathname } = request.nextUrl;
    const isProtectedRoute = pathname.includes('/projects') || pathname.includes('/profile') || pathname.includes('/set-password');
     // check session or automatic email for set password basically

    // I18N CHECK
    const pathnameHasLang = langs.some(
        (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
    );

    const acceptLanguage = request.headers.get('accept-language');
    const browserLang = acceptLanguage?.split(',')[0]?.split('-')[0];
    const currentLang = langs.includes(browserLang as any) ? browserLang : defaultLang;

    if (!pathnameHasLang) {
        const url = request.nextUrl.clone();
        const targetPath = pathname === '/' ? '' : pathname;
        url.pathname = `/${currentLang}${targetPath}`;
        return NextResponse.redirect(url);
    }

    // AUTH CHECK
    // TBD SUPABASE get sesion

    // PROT CHECK
    //if (isProtectedRoute && !isValidToken) {
    // delete token 
    // redirect to login page
        //const url = request.nextUrl.clone();
        //url.pathname = `/${currentLang}/login`; // Redirigimos al login con idioma
        //const response = NextResponse.redirect(url);
        //return response;
    

    return NextResponse.next();
}   


export const config = { matcher : [
  // Middleware will not run on API routes, static files, or images
 '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|.*\\.svg$).*)',
 '/'
],
}