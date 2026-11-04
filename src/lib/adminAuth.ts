import { timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';

/**
 * Password unica per l'area riservata (/iscritti e /gestisci-contenuti).
 * Solo lato server: non usare mai una variabile NEXT_PUBLIC_*, finirebbe nel bundle client.
 */
export function getAdminAccessSecret(): string | undefined {
  return process.env.ISCRITTI_LIST_PASSWORD || undefined;
}

// Confronto a tempo costante per evitare timing attack sulla password
export function safeCompareSecret(provided: string, expected: string): boolean {
  const providedBuf = Buffer.from(provided);
  const expectedBuf = Buffer.from(expected);
  if (providedBuf.length !== expectedBuf.length) return false;
  return timingSafeEqual(providedBuf, expectedBuf);
}

/**
 * Verifica la password admin. Restituisce `null` se valida, altrimenti la risposta
 * di errore da ritornare direttamente dalla route.
 */
export function requireAdminPassword(password: unknown): NextResponse | null {
  const required = getAdminAccessSecret();
  if (!required) {
    return NextResponse.json({ error: 'Password non configurata sul server' }, { status: 500 });
  }
  if (typeof password !== 'string' || !safeCompareSecret(password, required)) {
    return NextResponse.json({ error: 'Password errata o mancante' }, { status: 401 });
  }
  return null;
}
