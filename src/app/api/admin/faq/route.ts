import { NextRequest, NextResponse } from 'next/server';
import { getAdminAccessSecret, safeCompareSecret } from '@/lib/adminAuth';
import { plainTextToBlocks } from '@/lib/faqBlocks';

async function getNextOrdine(strapiUrl: string): Promise<number> {
  try {
    const res = await fetch(`${strapiUrl}/api/faqs?sort=ordine:desc&pagination[pageSize]=1`);
    if (!res.ok) return 0;
    const { data } = await res.json();
    const max = data?.[0]?.ordine;
    return Number.isInteger(max) ? max + 1 : 0;
  } catch {
    return 0;
  }
}

// Crea una nuova FAQ. Stesso pattern delle altre route admin: token dedicato
// lato server, nessun permesso pubblico allargato su Strapi.
export async function POST(request: NextRequest) {
  let body: { password?: string; domanda?: string; risposta?: string; attivo?: boolean } | null = null;
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

  const domanda = (body?.domanda || '').toString().trim();
  const rispostaText = (body?.risposta || '').toString().trim();
  if (!domanda || !rispostaText) {
    return NextResponse.json({ error: 'Domanda e risposta sono obbligatorie' }, { status: 400 });
  }
  const attivo = body?.attivo !== false;

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  try {
    const ordine = await getNextOrdine(strapiUrl);

    const createResponse = await fetch(`${strapiUrl}/api/faqs?status=published`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: { domanda, risposta: plainTextToBlocks(rispostaText), ordine, attivo },
      }),
    });

    if (!createResponse.ok) {
      const details = await createResponse.text();
      return NextResponse.json({ error: 'Creazione FAQ fallita', details }, { status: 502 });
    }

    const created = await createResponse.json();
    return NextResponse.json({ success: true, faq: created?.data ?? null });
  } catch (err) {
    console.error('[admin/faq] Errore interno', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Errore interno', details: message }, { status: 500 });
  }
}
