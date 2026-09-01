import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveRegistration, isSessionStillValid } from '../registrationSession';

/**
 * Finto backend Strapi che replica esattamente i permessi confermati sul progetto reale
 * (query diretta a beverino-bike-festival-BE/.tmp/data.db, tabelle up_permissions /
 * up_permissions_role_lnk): il ruolo "public" ha find, findOne e create su `iscrizioni`,
 * ma NON ha update. Un PUT su /api/iscrizionis/:id restituisce quindi sempre 403, e
 * codice_registrazione/session_token sono `unique: true` sullo schema Strapi.
 */
function createFakeStrapi() {
  let nextId = 1;
  const records: Array<Record<string, any>> = [];

  const fetchImpl = vi.fn(async (url: string, init?: RequestInit) => {
    const method = init?.method || 'GET';

    if (method === 'GET' && url.includes('/api/iscrizionis?filters[session_token]')) {
      const token = decodeURIComponent(url.split('$eq]=')[1]);
      const data = records.filter((r) => r.session_token === token);
      return jsonResponse(200, { data });
    }

    if (method === 'POST' && url.endsWith('/api/iscrizionis')) {
      const body = JSON.parse((init!.body as string));
      const { data: fields } = body;

      const duplicate = records.some(
        (r) =>
          r.codice_registrazione === fields.codice_registrazione ||
          r.session_token === fields.session_token
      );
      if (duplicate) {
        return jsonResponse(400, {
          error: { status: 400, name: 'ValidationError', message: 'This attribute must be unique' },
        });
      }

      const record = { id: nextId++, ...fields };
      records.push(record);
      return jsonResponse(200, { data: record });
    }

    if (method === 'PUT' && /\/api\/iscrizionis\/\d+$/.test(url)) {
      // Permesso "update" assente per il ruolo public: sempre 403.
      return jsonResponse(403, {
        error: { status: 403, name: 'ForbiddenError', message: 'Forbidden' },
      });
    }

    throw new Error(`Unhandled fake request: ${method} ${url}`);
  });

  return { fetch: fetchImpl, records };
}

function jsonResponse(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

const strapiUrl = 'http://localhost:1337';

const personA = { nome: 'Mario', cognome: 'Rossi', numeroDocumento: 'AA111', email: 'mario@example.com' };
const personB = { nome: 'Luigi', cognome: 'Verdi', numeroDocumento: 'BB222', email: 'luigi@example.com' };

describe('teoria del bug: session_token/codice_registrazione riusati per una persona diversa', () => {
  let strapi: ReturnType<typeof createFakeStrapi>;

  beforeEach(() => {
    strapi = createFakeStrapi();
    vi.stubGlobal('fetch', strapi.fetch);
  });

  /**
   * Riproduzione fedele della logica PRE-fix in IscrizioneWizard/index.tsx
   * (saveRegistrationToStrapi, righe 350-395 prima della modifica): se il check GET
   * trova già un'iscrizione con lo stesso session_token, tenta un PUT di aggiornamento;
   * se il PUT fallisce l'errore viene inghiottito silenziosamente e si ricade su una
   * POST che riusa lo stesso codice_registrazione/session_token già esistenti.
   */
  async function saveRegistrationOldBuggyLogic(
    sessionToken: string,
    codiceRegistrazione: string,
    payload: Record<string, unknown>
  ): Promise<{ ok: boolean }> {
    try {
      const checkResponse = await fetch(
        `${strapiUrl}/api/iscrizionis?filters[session_token][$eq]=${sessionToken}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      );
      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        if (checkData.data && checkData.data.length > 0) {
          const existing = checkData.data[0];
          const updateResponse = await fetch(`${strapiUrl}/api/iscrizionis/${existing.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: { ...payload, codice_registrazione: codiceRegistrazione } }),
          });
          if (!updateResponse.ok) {
            throw new Error('Errore aggiornamento iscrizione');
          }
          return { ok: true };
        }
      }
    } catch {
      // fallthrough silenzioso identico al codice originale
    }

    const response = await fetch(`${strapiUrl}/api/iscrizionis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { ...payload, codice_registrazione: codiceRegistrazione, session_token: sessionToken } }),
    });
    if (!response.ok) {
      return { ok: false };
    }
    return { ok: true };
  }

  it('[RED] la logica precedente fallisce quando una seconda persona eredita session_token/codice della prima', async () => {
    const staleToken = 'stale-token-123';
    const staleCodice = 'CODICE-A';

    const first = await saveRegistrationOldBuggyLogic(staleToken, staleCodice, personA);
    expect(first.ok).toBe(true);

    // La seconda iscrizione (persona diversa) eredita lo stesso session_token/codice
    // perché rimasti in localStorage (pagamento della prima persona mai confermato).
    const second = await saveRegistrationOldBuggyLogic(staleToken, staleCodice, personB);

    expect(second.ok).toBe(false);
    expect(strapi.records).toHaveLength(1);
    expect(strapi.records[0].nome).toBe('Mario'); // il dato di B non è mai stato salvato
  });

  it('[GREEN] la nuova saveRegistration() completa il salvataggio anche riusando lo stesso session_token', async () => {
    const staleToken = 'stale-token-123';
    const staleCodice = 'CODICE-A';
    let generated = 0;
    const generateIdentifiers = () => {
      generated += 1;
      return { sessionToken: `fresh-token-${generated}`, codiceRegistrazione: `CODICE-FRESH-${generated}` };
    };

    const first = await saveRegistration({
      strapiUrl,
      sessionToken: staleToken,
      codiceRegistrazione: staleCodice,
      payload: personA,
      generateIdentifiers,
    });
    expect(first.ok).toBe(true);
    expect(first.registrationId).toBe(1);

    const second = await saveRegistration({
      strapiUrl,
      sessionToken: staleToken, // stesso token stantio della persona A
      codiceRegistrazione: staleCodice,
      payload: personB,
      generateIdentifiers,
    });

    expect(second.ok).toBe(true);
    expect(second.registrationId).toBe(2);
    expect(second.sessionToken).not.toBe(staleToken);
    expect(second.codiceRegistrazione).not.toBe(staleCodice);

    expect(strapi.records).toHaveLength(2);
    expect(strapi.records[1].nome).toBe('Luigi');
    expect(strapi.records[1].session_token).not.toBe(staleToken);
  });

  it('saveRegistration() riusa lo stesso record se è davvero un retry della stessa persona (nessuna PUT, nessun duplicato)', async () => {
    const token = 'token-retry';
    const codice = 'CODICE-RETRY';
    const generateIdentifiers = () => ({ sessionToken: 'unused', codiceRegistrazione: 'unused' });

    const first = await saveRegistration({ strapiUrl, sessionToken: token, codiceRegistrazione: codice, payload: personA, generateIdentifiers });
    const retry = await saveRegistration({ strapiUrl, sessionToken: token, codiceRegistrazione: codice, payload: personA, generateIdentifiers });

    expect(retry.ok).toBe(true);
    expect(retry.registrationId).toBe(first.registrationId);
    expect(strapi.records).toHaveLength(1); // nessuna seconda create, nessuna PUT tentata
    const putCalls = strapi.fetch.mock.calls.filter(([, init]) => (init as RequestInit | undefined)?.method === 'PUT');
    expect(putCalls).toHaveLength(0);
  });
});

describe('isSessionStillValid', () => {
  it('ritorna true se esiste un record con quel session_token', async () => {
    const strapi = createFakeStrapi();
    strapi.records.push({ id: 1, session_token: 'abc', codice_registrazione: 'X' });
    vi.stubGlobal('fetch', strapi.fetch);

    await expect(isSessionStillValid(strapiUrl, 'abc')).resolves.toBe(true);
  });

  it('ritorna false se il record non esiste (sessione orfana)', async () => {
    const strapi = createFakeStrapi();
    vi.stubGlobal('fetch', strapi.fetch);

    await expect(isSessionStillValid(strapiUrl, 'inesistente')).resolves.toBe(false);
  });
});
