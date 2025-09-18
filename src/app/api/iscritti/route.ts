import { NextRequest, NextResponse } from 'next/server';

// Endpoint protetto da chiave per elencare solo iscrizioni con pagamento completato
// Usa ?key=... in query string. Imposta la chiave in ENV: PUBLIC_LIST_KEY o ISCRITTI_LIST_KEY

type StrapiRegistration = Record<string, any> & { id: number };

function getAccessSecret(): string | undefined {
  return (
    process.env.ISCRITTI_LIST_PASSWORD ||
    process.env.ISCRITTI_LIST_KEY ||
    process.env.PUBLIC_LIST_KEY ||
    process.env.NEXT_PUBLIC_LIST_KEY
  );
}

function normalizeEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  return email.trim().toLowerCase();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key') || '';

  const requiredKey = getAccessSecret();
  if (!requiredKey) {
    return NextResponse.json({ error: 'Chiave non configurata' }, { status: 500 });
  }
  if (key !== requiredKey) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  // Nessun filtro: recupera tutta la lista (ordinata per createdAt), specifica esplicitamente i campi
  const params = new URLSearchParams();
  params.set('pagination[pageSize]', '1000');
  params.set('sort', 'createdAt:asc');
  const fields = [
    'nome',
    'cognome',
    'email',
    'tipo_gara',
    'pasta_party',
    'conteggio_pastaparty',
    'taglia_maglietta',
    'stato_pagamento',
    'codice_registrazione',
    'createdAt',
    'publishedAt'
  ];
  fields.forEach((f, i) => params.set(`fields[${i}]`, f));
  // Filtro: solo pagamenti completati
  params.set('filters[stato_pagamento][$eq]', 'completato');
  // Popola dati del genitore se presenti (per filtro minorenni)
  params.set('populate[dati_genitore]', 'true');
  // Includi eventuali campi diretti per tutore
  params.set('fields[11]', 'nomeTutore');
  params.set('fields[12]', 'cognomeTutore');
  const url = `${strapiUrl}/api/iscrizionis?${params.toString()}`;

  try {
    // Fetch da Strapi (solo completati)
    const headers: Record<string, string> = {};
    const apiToken = process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    if (apiToken) {
      headers['Authorization'] = `Bearer ${apiToken}`;
    }
    const res = await fetch(url, { next: { revalidate: 30 }, headers });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: 'Errore Strapi', details: text, status: res.status }, { status: 502 });
    }
    const data = await res.json();
    const raw: any[] = data.data || [];
    // Appiattisci eventuale struttura { id, attributes: {...} } in un oggetto piatto
    const items: StrapiRegistration[] = raw.map((r: any) => (
      r && r.attributes ? { id: r.id, ...r.attributes } : r
    ));
    // NESSUN dedupe: ritorna tutto per verifica
    return NextResponse.json({ count: items.length, data: items });
  } catch (err: any) {
    console.error('[iscritti API] Internal error', err);
    return NextResponse.json({ error: 'Errore interno', details: String(err?.message || err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Accesso via password in body: { password: "..." }
  let body: any = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body non valido' }, { status: 400 });
  }

  const password = (body?.password || '').toString();
  const required = getAccessSecret();
  if (!required) {
    return NextResponse.json({ error: 'Password non configurata' }, { status: 500 });
  }
  if (password !== required) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  // Riutilizza la GET interna per la logica principale senza duplicare
  const proxyUrl = new URL(request.url);
  proxyUrl.searchParams.set('key', required);
  return GET(new NextRequest(proxyUrl.toString(), { headers: request.headers }));
}


