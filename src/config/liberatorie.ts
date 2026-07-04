import { EVENT } from './event';

/** Tipi di gara gestiti dal wizard online (Open Day resta offline). */
export type OnlineTipoGara = 'ciclistica' | 'running';

export interface LiberatoriaCopy {
  /** Nome evento per UI (es. "Beverino Bike Festival"). */
  displayName: string;
  /** Titolo modulo in maiuscolo per PDF. */
  moduleTitle: string;
  /** Nome evento nella frase di iscrizione (pag. 1). */
  enrollmentEventName: string;
  /** Etichetta autorizzazione foto (pag. 3). */
  photoAuthorizationLabel: string;
  /** Nome regolamento accettato (pag. 3). */
  regulationLabel: string;
  /** Organizzazione per trattamento dati (pag. 3). */
  privacyOrganizationLabel: string;
}

export const LIBERATORIA_COPY: Record<OnlineTipoGara, LiberatoriaCopy> = {
  ciclistica: {
    displayName: 'Beverino Bike Festival',
    moduleTitle: 'BEVERINO BIKE FESTIVAL',
    enrollmentEventName: 'Beverino Bike Festival',
    photoAuthorizationLabel: `Beverino Bike Festival ${EVENT.eventDateShort}`,
    regulationLabel: `B.B.F. ${EVENT.year}`,
    privacyOrganizationLabel: `Beverino Bike Festival ${EVENT.eventDateShort}`,
  },
  running: {
    displayName: 'Beverino Walk Festival',
    moduleTitle: 'BEVERINO WALK FESTIVAL',
    enrollmentEventName: 'Beverino Walk Festival',
    photoAuthorizationLabel: `Beverino Walk Festival ${EVENT.eventDateShort}`,
    regulationLabel: `Beverino Walk Festival ${EVENT.year}`,
    privacyOrganizationLabel: `Beverino Walk Festival ${EVENT.eventDateShort}`,
  },
};

/** Riferimento copy Open Day (solo file statico in public/, non wizard). */
export const OPEN_DAY_LIBERATORIA = {
  displayName: 'Open Day',
  moduleTitle: 'Open Day',
  enrollmentEventName: 'Open Day',
  photoAuthorizationLabel: `Open Day ${EVENT.eventDateShort}`,
  regulationLabel: `Open Day ${EVENT.year}`,
  privacyOrganizationLabel: `Open Day ${EVENT.eventDateShort}`,
} as const;

export function isOnlineTipoGara(value: string): value is OnlineTipoGara {
  return value === 'ciclistica' || value === 'running';
}

export function getLiberatoriaCopy(tipoGara: string): LiberatoriaCopy {
  if (tipoGara === 'running') return LIBERATORIA_COPY.running;
  return LIBERATORIA_COPY.ciclistica;
}

export function getGaraDisplayName(tipoGara: string): string {
  return getLiberatoriaCopy(tipoGara).displayName;
}

/** Timestamp formattato per accettazione digitale nel PDF. */
export function formatAccettazioneDigitale(date: Date = new Date()): string {
  return date.toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Rome',
  });
}

/** Data di compilazione in formato gg/mm/aaaa. */
export function formatCompilationDate(date: Date = new Date()): string {
  return date.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Europe/Rome',
  });
}

/** Es. "la spezia" → "La Spezia" */
export function formatComuneTitleCase(comune: string): string {
  if (!comune?.trim()) return '___________';

  const lowercaseParticles = new Set([
    'a', 'e', 'i', 'o', 'u', 'di', 'del', 'della', 'dei', 'delle', 'in', 'la', 'le', 'lo', 'gli',
  ]);

  return comune
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      if (index > 0 && lowercaseParticles.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/** Es. "Luogo e Data, La Spezia 04/07/2026" */
export function buildLuogoEData(
  comuneResidenza: string,
  compilationDate?: string
): string {
  const luogo = formatComuneTitleCase(comuneResidenza);
  const data = compilationDate || formatCompilationDate();
  return `Luogo e Data, ${luogo} ${data}`;
}
