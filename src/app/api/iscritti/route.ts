import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPassword } from '@/lib/adminAuth';
import { getStrapiUrl, strapiAuthHeaders } from '@/lib/strapiServer';

/**
 * Elenco iscritti con pagamento completato, per l'area riservata /iscritti.
 *
 * La password viaggia nel body (mai in query string, finirebbe nei log) e Strapi viene
 * interrogato lato server con il token API: il browser non vede mai l'endpoint
 * `iscrizionis` né campi sensibili come documento, residenza o session_token.
 */

// Solo i campi effettivamente mostrati/esportati dalla pagina /iscritti.
const FIELDS = [
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
  'nomeTutore',
  'cognomeTutore',
] as const;

// Il backend ha maxLimit=130 su iscrizioni e accetta solo paginazione a offset
// (start/limit): senza paginare Strapi tronca silenziosamente il risultato.
const PAGE_LIMIT = 100;

export async function POST(request: NextRequest) {
  let body: { password?: unknown } | null = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Richiesta non valida' }, { status: 400 });
  }

  const authError = requireAdminPassword(body?.password);
  if (authError) return authError;

  const strapiUrl = getStrapiUrl();
  const rows: Record<string, unknown>[] = [];
  let start = 0;
  let total = Infinity;

  try {
    while (start < total) {
      const params = new URLSearchParams();
      params.set('filters[stato_pagamento][$eq]', 'completato');
      params.set('sort', 'createdAt:asc');
      params.set('pagination[start]', String(start));
      params.set('pagination[limit]', String(PAGE_LIMIT));
      FIELDS.forEach((field, i) => params.set(`fields[${i}]`, field));
      // Del genitore servono solo nome/cognome (filtro minorenni ed export)
      params.set('populate[dati_genitore][fields][0]', 'nome');
      params.set('populate[dati_genitore][fields][1]', 'cognome');

      const res = await fetch(`${strapiUrl}/api/iscrizionis?${params.toString()}`, {
        headers: strapiAuthHeaders(),
        cache: 'no-store',
      });
      if (!res.ok) {
        console.error('[iscritti API] Errore Strapi', res.status, await res.text());
        return NextResponse.json({ error: `Errore Strapi (${res.status})` }, { status: 502 });
      }

      const data = await res.json();
      const page: Record<string, unknown>[] = data.data || [];
      rows.push(...page);
      total = data.meta?.pagination?.total ?? rows.length;
      if (page.length === 0) break;
      start += PAGE_LIMIT;
    }
  } catch (err) {
    console.error('[iscritti API] Errore interno', err);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }

  return NextResponse.json({ count: rows.length, data: rows });
}
