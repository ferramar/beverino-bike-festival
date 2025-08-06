// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Lista delle pagine da reindirizzare alla home
  const pagesUnderConstruction = ['/faq'];
  
  // Controlla se il percorso corrente è nella lista
  if (pagesUnderConstruction.includes(pathname)) {
    // Redirect alla home
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Per tutte le altre pagine, continua normalmente
  return NextResponse.next();
}

// Configurazione del middleware - specifica su quali percorsi eseguire
export const config = {
  matcher: [
    /*
     * Esegui il middleware su tutti i percorsi tranne:
     * - api (API routes)
     * - _next/static (file statici)
     * - _next/image (ottimizzazione immagini) 
     * - favicon.ico (favicon)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};