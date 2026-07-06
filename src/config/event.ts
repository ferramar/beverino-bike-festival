/**
 * Fonte unica di verità per i dati dell'edizione corrente del Beverino Bike Festival.
 *
 * Aggiornando i valori qui sotto si propagano automaticamente in tutto il sito
 * (date, countdown, metadata SEO, liberatoria, email di conferma, prezzi, ecc.).
 * Per la prossima edizione basta modificare questo file.
 */

export const EVENT = {
  /** Numero dell'edizione (es. 5 = quinta edizione). */
  edition: 5,
  /** Ordinale testuale dell'edizione, usato nei testi ("quinta edizione"). */
  editionLabel: "quinta",
  /** Anno dell'evento. */
  year: 2026, 
  /** Data/ora di inizio evento in formato ISO, usata per il countdown. */
  eventDateISO: "2026-09-20T00:00:00",
  /** Data evento in formato breve (documenti/liberatoria). */
  eventDateShort: "20/09/2026",
  /** Data evento in formato esteso, usata nei testi visibili. */
  eventDateLabel: "20 Settembre 2026",
  /**
   * Chiusura iscrizioni online (ISO). Configurabile via env NEXT_PUBLIC_REG_CLOSING_ISO,
   * con fallback al valore di default se la env manca.
   * NB: in produzione il valore effettivo arriva dalla env di Vercel.
   */
  registrationClosingISO:
    process.env.NEXT_PUBLIC_REG_CLOSING_ISO || "2026-09-19T23:59:59",
  /**
   * Apertura iscrizioni online (ISO). Configurabile via env NEXT_PUBLIC_REG_OPENING_ISO.
   */
  /**
   * feat/iscrizione-form-ux: apertura anticipata per test del form.
   * Al merge su main ripristinare "2026-07-07T00:00:00".
   */
  registrationOpeningISO:
    process.env.NEXT_PUBLIC_REG_OPENING_ISO || "2026-01-01T00:00:00",
  /** Località dell'evento. */
  location: "Beverino (SP)",
  /** URL canonico del sito. */
  siteUrl: "https://beverinobikefestival.it",
} as const;

/**
 * Prezzi in euro (valori interi). I centesimi richiesti da Stripe si ottengono
 * con {@link toCents}. Per la ciclistica usare {@link getCiclisticaPrice} (fasce date).
 */
export const PRICING = {
  /** Prezzo massimo ciclistica (ultima fascia). Per il prezzo corrente: getCiclisticaPrice(). */
  ciclistica: 25,
  /** Iscrizione Beverino Walk Festival. */
  running: 10,
  /** Pasta Party, prezzo per persona (partecipanti e accompagnatori). */
  pastaParty: 13,
} as const;

/** Converte un importo in euro nei centesimi richiesti da Stripe. */
export const toCents = (euro: number): number => Math.round(euro * 100);
