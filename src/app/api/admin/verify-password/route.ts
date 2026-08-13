import { NextRequest, NextResponse } from 'next/server';
import { getAdminAccessSecret, safeCompareSecret } from '@/lib/adminAuth';

// Verifica la password della sezione "gestisci contenuti" senza effettuare alcuna scrittura.
// Serve solo per dare un feedback immediato nel gate UI: l'autorizzazione reale
// viene comunque rivalidata server-side ad ogni chiamata di scrittura (vedi /api/admin/media).
export async function POST(request: NextRequest) {
  let body: { password?: string } | null = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Richiesta non valida' }, { status: 400 });
  }

  const required = getAdminAccessSecret();
  if (!required) {
    return NextResponse.json(
      { ok: false, error: 'Password non configurata sul server' },
      { status: 500 }
    );
  }

  const password = (body?.password || '').toString();
  if (!safeCompareSecret(password, required)) {
    return NextResponse.json({ ok: false, error: 'Password errata' }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
