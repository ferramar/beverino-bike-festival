import { NextRequest, NextResponse } from 'next/server';
import { getAdminAccessSecret, safeCompareSecret } from '@/lib/adminAuth';
import { uploadImageToStrapi, StrapiUploadError } from '@/lib/strapiAdminUpload';

function parseCategorie(raw: FormDataEntryValue | null): number[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw.toString());
    return Array.isArray(parsed) ? parsed.filter((n) => Number.isInteger(n)) : [];
  } catch {
    return [];
  }
}

type RouteContext = { params: Promise<{ id: string }> };

// Aggiorna uno sponsor esistente. Il logo viene sostituito solo se ne viene
// inviato uno nuovo; se omesso, quello esistente resta invariato.
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Richiesta non valida' }, { status: 400 });
  }

  const required = getAdminAccessSecret();
  if (!required) {
    return NextResponse.json({ error: 'Password non configurata sul server' }, { status: 500 });
  }
  const password = (formData.get('password') || '').toString();
  if (!safeCompareSecret(password, required)) {
    return NextResponse.json({ error: 'Password errata o mancante' }, { status: 401 });
  }

  const apiToken = process.env.STRAPI_API_TOKEN;
  if (!apiToken) {
    return NextResponse.json({ error: 'STRAPI_API_TOKEN non configurato sul server' }, { status: 500 });
  }

  const nome = (formData.get('nome') || '').toString().trim();
  if (!nome) {
    return NextResponse.json({ error: 'Il nome dello sponsor è obbligatorio' }, { status: 400 });
  }

  const descrizione = (formData.get('descrizione') || '').toString();
  const sito = (formData.get('sito') || '').toString();
  const principale = (formData.get('principale') || '').toString() === 'true';
  const categorie_sponsors = parseCategorie(formData.get('categorie'));
  const logoFile = formData.get('logo');

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  try {
    let logoId: number | undefined;
    if (logoFile instanceof File && logoFile.size > 0) {
      logoId = await uploadImageToStrapi(logoFile, strapiUrl, apiToken);
    }

    const updateResponse = await fetch(`${strapiUrl}/api/sponsors/${id}?status=published`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          nome,
          descrizione,
          sito,
          principale,
          categorie_sponsors,
          ...(logoId ? { logo: logoId } : {}),
        },
      }),
    });

    if (!updateResponse.ok) {
      const details = await updateResponse.text();
      return NextResponse.json({ error: 'Aggiornamento sponsor fallito', details }, { status: 502 });
    }

    const updated = await updateResponse.json();
    return NextResponse.json({ success: true, sponsor: updated?.data ?? null });
  } catch (err) {
    if (err instanceof StrapiUploadError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error('[admin/sponsors/id PUT] Errore interno', err);
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
    const deleteResponse = await fetch(`${strapiUrl}/api/sponsors/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiToken}` },
    });

    if (!deleteResponse.ok) {
      const details = await deleteResponse.text();
      return NextResponse.json({ error: 'Eliminazione sponsor fallita', details }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/sponsors/id DELETE] Errore interno', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Errore interno', details: message }, { status: 500 });
  }
}
