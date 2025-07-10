// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Percorsi che NON devono essere reindirizzati
  const allowedPaths = [
    '/',                    // Homepage
    '/api',                 // Tutte le API routes
    '/_next',              // File Next.js interni
    '/favicon.ico',        // Favicon
    '/robots.txt',         // Robots per SEO
    '/sitemap.xml',        // Sitemap per SEO
    '/logo.png',           // Logo e immagini pubbliche
    '/banner.jpg',         // Banner immagine
    '/damiani-ottica-logo.png', // Logo sponsor
    '/liberatorie',        // Cartella liberatorie PDF
  ];
  
  // Controlla se il percorso è permesso
  const isAllowed = allowedPaths.some(path => {
    if (path.includes('.')) {
      // Per file specifici, match esatto
      return pathname === path;
    }
    // Per cartelle, controlla se inizia con il path
    return pathname === path || pathname.startsWith(path + '/');
  });
  
  // Se non è permesso, redirect alla home
  if (!isAllowed) {
    // Log per debug (rimuovi in produzione)
    console.log(`Redirecting ${pathname} to homepage`);
    
    // Usa redirect 307 (temporaneo) invece di 308 (permanente)
    // così quando rimuovi il middleware, Google re-indicizzerà le pagine
    return NextResponse.redirect(new URL('/', request.url), 307);
  }
  
  return NextResponse.next();
}

// Configurazione del middleware
export const config = {
  matcher: [
    /*
     * Esegui il middleware su tutti i percorsi TRANNE:
     * - api (API routes)
     * - _next/static (file statici)
     * - _next/image (ottimizzazione immagini)
     * - I file con estensione nella public (gestiti sopra)
     */
    '/((?!_next/static|_next/image).*)',
  ],
};