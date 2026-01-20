import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { langs, defaultLang } from "../utils/i18n-config";
import { jwtVerify } from "jose";



export async function middleware(request : NextRequest) {
    const { pathname } = request.nextUrl;
    const isProtectedRoute = pathname.includes('/projects') || pathname.includes('/profile');

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
    const token = request.cookies.get('auth_token')?.value;
    let isValidToken = false;

    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(token, secret);
            isValidToken = true;
        } catch (error) {
            console.error("JWT verification failed:", error);
        }
    }

    // PROT CHECK
    if (isProtectedRoute && !isValidToken) {
        const url = request.nextUrl.clone();
        url.pathname = `/${currentLang}/login`; // Redirigimos al login con idioma
        const response = NextResponse.redirect(url);
        if (token) response.cookies.delete('auth_token');
        return response;
    }

    return NextResponse.next();
}   


export const config = { matcher : [
  // Middleware will not run on API routes, static files, or images
 '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|.*\\.svg$).*)',
 '/'
],
}