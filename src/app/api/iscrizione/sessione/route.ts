import { NextRequest, NextResponse } from 'next/server';
import { isSessionStillValid } from '@/lib/registrationSession';
import { getStrapiUrl, strapiAuthHeaders } from '@/lib/strapiServer';

/**
 * Verifica se il session_token di una sessione ripristinata corrisponde ancora a
 * un'iscrizione su Strapi. Restituisce solo un booleano, mai i dati dell'iscrizione.
 */
export async function POST(request: NextRequest) {
  let body: { sessionToken?: unknown } | null = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Richiesta non valida' }, { status: 400 });
  }

  const token = body?.sessionToken;
  if (typeof token !== 'string' || !/^[\w-]{10,64}$/.test(token)) {
    return NextResponse.json({ valid: false });
  }

  const valid = await isSessionStillValid(getStrapiUrl(), token, strapiAuthHeaders());
  return NextResponse.json({ valid });
}
