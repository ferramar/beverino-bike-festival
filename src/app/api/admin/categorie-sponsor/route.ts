import { NextRequest, NextResponse } from 'next/server';
import { getAdminAccessSecret, safeCompareSecret } from '@/lib/adminAuth';

// Crea una nuova categoria sponsor. Stesso pattern delle altre route admin:
// token dedicato lato server, nessun permesso pubblico allargato su Strapi.
export async function POST(request: NextRequest) {
  let body: { password?: string; nome?: string } | null = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Richiesta non valida' }, { status: 400 });
  }

  const required = getAdminAccessSecret();
  if (!required) {
    return NextResponse.json({ error: 'Password non configurata sul server' }, { status: 500 });
  }
  const password = (body?.password || '').toString();
  if (!safeCompareSecret(password, required)) {
    return NextResponse.json({ error: 'Password errata o mancante' }, { status: 401 });
  }

  const apiToken = process.env.STRAPI_API_TOKEN;
  if (!apiToken) {
    return NextResponse.json({ error: 'STRAPI_API_TOKEN non configurato sul server' }, { status: 500 });
  }

  const nome = (body?.nome || '').toString().trim();
  if (!nome) {
    return NextResponse.json({ error: 'Il nome della categoria è obbligatorio' }, { status: 400 });
  }

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  try {
    const createResponse = await fetch(`${strapiUrl}/api/categorie-sponsors?status=published`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: { nome } }),
    });

    if (!createResponse.ok) {
      const details = await createResponse.text();
      return NextResponse.json({ error: 'Creazione categoria fallita', details }, { status: 502 });
    }

    const created = await createResponse.json();
    return NextResponse.json({ success: true, categoria: created?.data ?? null });
  } catch (err) {
    console.error('[admin/categorie-sponsor] Errore interno', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Errore interno', details: message }, { status: 500 });
  }
}
