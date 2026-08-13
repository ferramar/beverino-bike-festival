import { NextRequest, NextResponse } from 'next/server';
import { getAdminAccessSecret, safeCompareSecret } from '@/lib/adminAuth';

// Carica una o più foto su Strapi (plugin Upload) e crea un nuovo record media-edizionis
// per l'anno scelto. Usa sempre un token API dedicato lato server (mai NEXT_PUBLIC_*,
// finirebbe nel bundle client esponendo un token con permesso di scrittura) — il ruolo
// Public di Strapi non viene toccato/allargato per questa funzionalità.

const MAX_FILE_BYTES = 15 * 1024 * 1024; // sotto i 20MB del plugin upload Strapi
const MIN_YEAR = 2000;

export async function POST(request: NextRequest) {
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
    return NextResponse.json(
      { error: 'STRAPI_API_TOKEN non configurato sul server' },
      { status: 500 }
    );
  }

  const edizioneRaw = (formData.get('edizione') || '').toString();
  const edizione = Number(edizioneRaw);
  const maxYear = new Date().getFullYear() + 1;
  if (!Number.isInteger(edizione) || edizione < MIN_YEAR || edizione > maxYear) {
    return NextResponse.json({ error: 'Anno edizione non valido' }, { status: 400 });
  }

  const files = formData.getAll('files').filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: 'Nessun file selezionato' }, { status: 400 });
  }

  const invalid = files.find((f) => !f.type.startsWith('image/') || f.size > MAX_FILE_BYTES);
  if (invalid) {
    return NextResponse.json(
      { error: `File non valido: ${invalid.name}` },
      { status: 400 }
    );
  }

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  try {
    const uploadFormData = new FormData();
    files.forEach((file) => uploadFormData.append('files', file, file.name));

    const uploadResponse = await fetch(`${strapiUrl}/api/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiToken}` },
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      const details = await uploadResponse.text();
      return NextResponse.json(
        { error: 'Upload su Strapi fallito', details },
        { status: 502 }
      );
    }

    const uploadedFiles: Array<{ id: number }> = await uploadResponse.json();
    const mediaIds = uploadedFiles.map((f) => f.id);

    const createResponse = await fetch(`${strapiUrl}/api/media-edizionis?status=published`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: { edizione, media: mediaIds } }),
    });

    if (!createResponse.ok) {
      const details = await createResponse.text();
      // I file sono già stati caricati su Strapi ma restano orfani (non collegati a nessun
      // record): nessun danno ai dati, solo spazio "sprecato" nella Media Library.
      return NextResponse.json(
        { error: 'Creazione record media-edizioni fallita', details },
        { status: 502 }
      );
    }

    const created = await createResponse.json();

    return NextResponse.json({
      success: true,
      edizione,
      uploadedCount: mediaIds.length,
      mediaEdizioneId: created?.data?.id ?? null,
    });
  } catch (err) {
    console.error('[admin/media] Errore interno', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Errore interno', details: message }, { status: 500 });
  }
}
