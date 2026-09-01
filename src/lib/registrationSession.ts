export interface SessionData {
  token: string;
  createdAt: number;
  ttl: number;
  registrationId?: number;
  codiceRegistrazione?: string;
  activeStep?: number;
}

export const SESSION_KEY = 'beverino_registration_session';
export const SESSION_TTL = 24 * 60 * 60 * 1000; // 24 ore

// sessionStorage (non localStorage): la sessione deve valere solo per la tab corrente,
// non sopravvivere alla sua chiusura né essere condivisa con altre tab. Questo elimina
// da solo il caso più comune del bug: aprire una nuova tab/scheda per iscrivere una
// seconda persona non eredita più nulla della prima.
export function readStoredSession(): SessionData | null {
  if (typeof sessionStorage === 'undefined') return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const session: SessionData = JSON.parse(raw);
    if (Date.now() - session.createdAt >= session.ttl) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function writeStoredSession(data: SessionData): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

export function clearStoredSession(): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem('iscrizione');
}

/**
 * Verifica che il session_token di una sessione ripristinata da localStorage corrisponda
 * ancora a un'iscrizione realmente presente su Strapi. Una sessione con registrationId ma
 * senza riscontro sul backend è "orfana" (es. pagamento della iscrizione precedente mai
 * confermato/redirect a /conferma mai avvenuto) e non va riusata: altrimenti il
 * codice_registrazione/session_token di quella iscrizione verrebbe riproposto per una
 * persona diversa, in collisione con i vincoli unique di Strapi.
 */
export async function isSessionStillValid(strapiUrl: string, token: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${strapiUrl}/api/iscrizionis?filters[session_token][$eq]=${encodeURIComponent(token)}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );
    if (!res.ok) return false;
    const data = await res.json();
    return Array.isArray(data?.data) && data.data.length > 0;
  } catch {
    return false;
  }
}

export interface SaveRegistrationParams {
  strapiUrl: string;
  sessionToken: string;
  codiceRegistrazione: string;
  payload: Record<string, unknown>;
  /** Genera una nuova coppia (session_token, codice_registrazione) in caso di conflitto d'identità. */
  generateIdentifiers: () => { sessionToken: string; codiceRegistrazione: string };
}

export interface SaveRegistrationResult {
  ok: boolean;
  registrationId?: number;
  codiceRegistrazione?: string;
  sessionToken?: string;
  errorDetail?: string;
}

const IDENTITY_FIELDS = ['nome', 'cognome', 'numeroDocumento'] as const;

function sameRegistrant(payload: Record<string, unknown>, existing: Record<string, unknown>): boolean {
  return IDENTITY_FIELDS.every((field) => payload[field] === existing[field]);
}

async function findBySessionToken(strapiUrl: string, sessionToken: string): Promise<Record<string, unknown> | null> {
  const res = await fetch(
    `${strapiUrl}/api/iscrizionis?filters[session_token][$eq]=${encodeURIComponent(sessionToken)}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data?.data?.length > 0 ? data.data[0] : null;
}

async function createRegistration(
  strapiUrl: string,
  sessionToken: string,
  codiceRegistrazione: string,
  payload: Record<string, unknown>
): Promise<SaveRegistrationResult> {
  const response = await fetch(`${strapiUrl}/api/iscrizionis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: { ...payload, codice_registrazione: codiceRegistrazione, session_token: sessionToken },
    }),
  });

  if (!response.ok) {
    let errorDetail = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      errorDetail = body?.error?.message || JSON.stringify(body?.error) || errorDetail;
    } catch {
      // risposta non JSON, mantieni l'HTTP status
    }
    console.error('Errore salvataggio iscrizione:', errorDetail);
    return { ok: false, errorDetail };
  }

  const result = await response.json();
  return { ok: true, registrationId: result.data.id, codiceRegistrazione, sessionToken };
}

/**
 * Salva l'iscrizione su Strapi.
 *
 * Il ruolo pubblico non ha il permesso "update" su iscrizioni (solo find/findOne/create):
 * un'iscrizione con lo stesso session_token già esistente non può quindi mai essere
 * aggiornata (l'update fallirebbe con 403). Se esiste ed è della STESSA persona (stesso
 * nome/cognome/numeroDocumento) è un retry sicuro: si riusa l'id esistente. Se invece i
 * dati anagrafici sono diversi, il session_token è stato riproposto da una sessione
 * precedente non conclusa (es. pagamento mai confermato) per una persona diversa: in tal
 * caso si generano nuovi identificativi e si crea una nuova iscrizione, invece di tentare
 * un update destinato a fallire o una create che collide con i vincoli unique.
 */
export async function saveRegistration({
  strapiUrl,
  sessionToken,
  codiceRegistrazione,
  payload,
  generateIdentifiers,
}: SaveRegistrationParams): Promise<SaveRegistrationResult> {
  let existing: Record<string, unknown> | null = null;
  try {
    existing = await findBySessionToken(strapiUrl, sessionToken);
  } catch (error) {
    console.error('Errore controllo iscrizione esistente:', error);
  }

  if (existing) {
    if (sameRegistrant(payload, existing)) {
      return {
        ok: true,
        registrationId: existing.id as number,
        codiceRegistrazione: existing.codice_registrazione as string,
        sessionToken,
      };
    }

    // session_token orfano riproposto per una persona diversa: ripartiamo da zero
    const fresh = generateIdentifiers();
    return createRegistration(strapiUrl, fresh.sessionToken, fresh.codiceRegistrazione, payload);
  }

  return createRegistration(strapiUrl, sessionToken, codiceRegistrazione, payload);
}
