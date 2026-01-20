

// helper for redirecting user depending on language (swapping locale only). For client components
    export const getRedirectedPathname = (pathname : string, targetLang : string)  => {
        if (!pathname) return "/";
        const segments = pathname.split("/");
        segments[1] = targetLang;
        const newPathname = segments.join("/");
        return newPathname.startsWith('/') ? newPathname : `/${newPathname}`;
    };