import { NextRequest, NextResponse } from 'next/server';
import { newRegistrationId, saveRegistration } from '@/lib/registrationSession';
import { getStrapiUrl, strapiAuthHeaders } from '@/lib/strapiServer';
import { isRegistrationOpen } from '@/utils/isRegistrationOpen';

/**
 * Salva un'iscrizione su Strapi (stato "in_attesa" di pagamento).
 *
 * Gira lato server con il token API, così il ruolo Public di Strapi non ha bisogno di
 * alcun permesso su `iscrizioni`. Il payload è filtrato su una whitelist di campi: lo
 * stato del pagamento, la data di pubblicazione e il log della firma (IP, user agent,
 * orario) vengono impostati qui e non possono essere forzati dal client.
 */

const REGISTRATION_FIELDS = [
  'nome',
  'cognome',
  'luogoNascita',
  'dataNascita',
  'comuneResidenza',
  'residenza',
  'numeroCivico',
  'cap',
  'email',
  'tipoDocumento',
  'numeroDocumento',
  'cittaRilascio',
  'dataRilascioDocumento',
  'nomeTutore',
  'cognomeTutore',
  'tipo_gara',
  'liberatoriaAccettata',
  'conteggio_pastaparty',
  'taglia_maglietta',
] as const;

const PARENT_FIELDS = [
  'nome',
  'cognome',
  'luogoNascita',
  'dataNascita',
  'comuneResidenza',
  'viaResidenza',
  'numeroCivico',
  'cap',
  'email',
  'tipoDocumento',
  'numeroDocumento',
  'cittaRilascio',
  'dataRilascioDocumento',
] as const;

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function pick(source: JsonObject, fields: readonly string[]): JsonObject {
  const out: JsonObject = {};
  for (const field of fields) {
    if (field in source) out[field] = source[field];
  }
  return out;
}

function isValidId(value: unknown): value is string {
  return typeof value === 'string' && /^[\w-]{10,64}$/.test(value);
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: NextRequest) {
  if (!isRegistrationOpen()) {
    return NextResponse.json({ error: 'Le iscrizioni online sono chiuse' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Richiesta non valida' }, { status: 400 });
  }
  if (!isObject(body) || !isObject(body.payload) || !isValidId(body.sessionToken)) {
    return NextResponse.json({ error: 'Richiesta non valida' }, { status: 400 });
  }

  const raw = body.payload;
  const conteggioPastaParty = Number(raw.conteggio_pastaparty) || 0;
  const payload: JsonObject = {
    ...pick(raw, REGISTRATION_FIELDS),
    conteggio_pastaparty: conteggioPastaParty,
    pasta_party: conteggioPastaParty > 0,
    dati_genitore: isObject(raw.dati_genitore) ? pick(raw.dati_genitore, PARENT_FIELDS) : null,
    log_firma_liberatoria: {
      orario_firmatario: new Date().toISOString(),
      ip_firmatario: getClientIp(request),
      user_agent_firmatario: request.headers.get('user-agent') || 'unknown',
    },
    stato_pagamento: 'in_attesa',
    publishedAt: new Date().toISOString(),
  };

  const result = await saveRegistration({
    strapiUrl: getStrapiUrl(),
    headers: strapiAuthHeaders(),
    sessionToken: body.sessionToken,
    codiceRegistrazione: isValidId(body.codiceRegistrazione) ? body.codiceRegistrazione : newRegistrationId(),
    payload,
    // Usato solo se il session_token risulta già associato a un'altra persona
    // (sessione orfana riproposta): vedi src/lib/registrationSession.ts.
    generateIdentifiers: () => ({
      sessionToken: newRegistrationId(),
      codiceRegistrazione: newRegistrationId(),
    }),
  });

  if (!result.ok) {
    return NextResponse.json({ error: 'Errore salvataggio iscrizione' }, { status: 502 });
  }

  return NextResponse.json({
    registrationId: result.registrationId,
    codiceRegistrazione: result.codiceRegistrazione,
    sessionToken: result.sessionToken,
  });
}
