import { PRICING, toCents } from './event';

export type GaraTipo = 'ciclistica' | 'running';

export interface CiclisticaTier {
  startISO: string;
  endISO: string;
  startLabel: string;
  endLabel: string;
  price: number;
  note?: string;
}

/** Fasce contributo partecipazione Beverino Bike Festival (ciclistica). */
export const CICLISTICA_TIERS: CiclisticaTier[] = [
  {
    startISO: '2026-07-07T00:00:00',
    endISO: '2026-07-27T23:59:59',
    startLabel: '07/07/26',
    endLabel: '27/07/26',
    price: 20,
  },
  {
    startISO: '2026-07-28T00:00:00',
    endISO: '2026-08-31T23:59:59',
    startLabel: '28/07/26',
    endLabel: '31/08/26',
    price: 25,
  },
  {
    startISO: '2026-09-01T00:00:00',
    endISO: '2026-09-19T23:59:59',
    startLabel: '01/09/26',
    endLabel: '19/09/26',
    price: 25,
    note: 'fino ad esaurimento garantito',
  },
];

export const CICLISTICA_INCLUDED = [
  'Pacco gara (fino ad esaurimento)',
  'Ristori a tema sul percorso',
  'Servizio docce',
  'Parcheggio',
] as const;

export const PASTA_PARTY_INFO = {
  label: 'Beverino Bike Pasta Party (pranzo)',
  description:
    'Tariffa unica di €13 sia per partecipanti che accompagnatori. Buoni pasto a numero limitato: si consiglia la prenotazione.',
} as const;

function tierStartMs(tier: CiclisticaTier): number {
  return new Date(tier.startISO).getTime();
}

function tierEndMs(tier: CiclisticaTier): number {
  return new Date(tier.endISO).getTime();
}

export function getActiveCiclisticaTier(date: Date = new Date()): CiclisticaTier | null {
  const t = date.getTime();
  return (
    CICLISTICA_TIERS.find((tier) => t >= tierStartMs(tier) && t <= tierEndMs(tier)) ?? null
  );
}

export function getCiclisticaPrice(date: Date = new Date()): number {
  const tier = getActiveCiclisticaTier(date);
  if (tier) return tier.price;
  if (date.getTime() < tierStartMs(CICLISTICA_TIERS[0])) {
    return CICLISTICA_TIERS[0].price;
  }
  return CICLISTICA_TIERS[CICLISTICA_TIERS.length - 1].price;
}

export function getGaraPrice(tipoGara: string, date: Date = new Date()): number {
  if (tipoGara === 'running') return PRICING.running;
  if (tipoGara === 'ciclistica') return getCiclisticaPrice(date);
  return 0;
}

export function calculateOrderTotal(
  tipoGara: string,
  pastaPartyCount = 0,
  date: Date = new Date()
): number {
  return getGaraPrice(tipoGara, date) + pastaPartyCount * PRICING.pastaParty;
}

export function calculateOrderTotalCents(
  tipoGara: string,
  pastaPartyCount = 0,
  date: Date = new Date()
): number {
  return toCents(calculateOrderTotal(tipoGara, pastaPartyCount, date));
}

export function formatTierRange(tier: CiclisticaTier): string {
  return `dal ${tier.startLabel} al ${tier.endLabel}`;
}

export function formatTierPriceLine(tier: CiclisticaTier): string {
  const base = `€ ${tier.price.toFixed(2).replace('.', ',')} con pacco gara`;
  return tier.note ? `${base} ${tier.note}` : base;
}
