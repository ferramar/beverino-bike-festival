import { NextRequest, NextResponse } from 'next/server';

// Endpoint SEMPLICE solo per download - niente paginazione, niente filtri complessi
// Usa ?key=... in query string

type StrapiRegistration = Record<string, any> & { id: number };

function getAccessSecret(): string | undefined {
  return (
    process.env.ISCRITTI_LIST_PASSWORD ||
    process.env.ISCRITTI_LIST_KEY ||
    process.env.PUBLIC_LIST_KEY ||
    process.env.NEXT_PUBLIC_LIST_KEY
  );
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

  // Chiamata SEMPLICE - solo i primi 100 record
  const params = new URLSearchParams();
  params.set('pagination[pageSize]', '100');
  params.set('sort', 'createdAt:asc');
  params.set('filters[stato_pagamento][$eq]', 'completato');
  
  const url = `${strapiUrl}/api/iscrizionis?${params.toString()}`;

  try {
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
    
    // I dati sono già piatti in Strapi v5
    const items: StrapiRegistration[] = raw;
    
    return NextResponse.json({ 
      count: items.length, 
      data: items,
      message: `Caricati ${items.length} iscritti con pagamento completato`
    });
  } catch (err: any) {
    console.error('[download-iscritti API] Internal error', err);
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

  // Riutilizza la GET interna
  const proxyUrl = new URL(request.url);
  proxyUrl.searchParams.set('key', required);
  return GET(new NextRequest(proxyUrl.toString(), { headers: request.headers }));
}
