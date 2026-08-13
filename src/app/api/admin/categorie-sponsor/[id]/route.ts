import { NextRequest, NextResponse } from 'next/server';
import { getAdminAccessSecret, safeCompareSecret } from '@/lib/adminAuth';

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;

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
    const updateResponse = await fetch(`${strapiUrl}/api/categorie-sponsors/${id}?status=published`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: { nome } }),
    });

    if (!updateResponse.ok) {
      const details = await updateResponse.text();
      return NextResponse.json({ error: 'Aggiornamento categoria fallito', details }, { status: 502 });
    }

    const updated = await updateResponse.json();
    return NextResponse.json({ success: true, categoria: updated?.data ?? null });
  } catch (err) {
    console.error('[admin/categorie-sponsor/id PUT] Errore interno', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Errore interno', details: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  let body: { password?: string } | null = null;
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

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  try {
    const deleteResponse = await fetch(`${strapiUrl}/api/categorie-sponsors/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiToken}` },
    });

    if (!deleteResponse.ok) {
      const details = await deleteResponse.text();
      return NextResponse.json({ error: 'Eliminazione categoria fallita', details }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/categorie-sponsor/id DELETE] Errore interno', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Errore interno', details: message }, { status: 500 });
  }
}
