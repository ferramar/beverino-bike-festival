import { timingSafeEqual } from 'crypto';

// Stessa password già usata per /iscritti, riutilizzata per la sezione /gestisci-contenuti
export function getAdminAccessSecret(): string | undefined {
  return (
    process.env.ISCRITTI_LIST_PASSWORD ||
    process.env.ISCRITTI_LIST_KEY ||
    process.env.PUBLIC_LIST_KEY ||
    process.env.NEXT_PUBLIC_LIST_KEY
  );
}

// Confronto a tempo costante per evitare timing attack sulla password
export function safeCompareSecret(provided: string, expected: string): boolean {
  const providedBuf = Buffer.from(provided);
  const expectedBuf = Buffer.from(expected);
  if (providedBuf.length !== expectedBuf.length) return false;
  return timingSafeEqual(providedBuf, expectedBuf);
}
