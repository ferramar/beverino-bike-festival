export interface ComuneOption {
  nome: string;
  sigla: string;
  cap: string;
  label: string;
}

let comuniCache: ComuneOption[] | null = null;

function toComuneOption(raw: {
  nome: string;
  sigla: string;
  cap?: string[];
}): ComuneOption {
  const cap = raw.cap?.[0] ?? '';
  return {
    nome: raw.nome,
    sigla: raw.sigla,
    cap,
    label: `${raw.nome} (${raw.sigla})`,
  };
}

export async function loadComuni(): Promise<ComuneOption[]> {
  if (comuniCache) return comuniCache;

  const data = (await import('comuni-json/comuni.json')).default as Array<{
    nome: string;
    sigla: string;
    cap?: string[];
  }>;

  comuniCache = data.map(toComuneOption);
  return comuniCache;
}

export function searchComuni(comuni: ComuneOption[], query: string, limit = 12): ComuneOption[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  return comuni
    .filter(
      (c) =>
        c.nome.toLowerCase().includes(q) ||
        c.label.toLowerCase().includes(q) ||
        c.cap.startsWith(q)
    )
    .slice(0, limit);
}

export function findComuneByName(comuni: ComuneOption[], name: string): ComuneOption | undefined {
  const normalized = name.trim().toLowerCase();
  return comuni.find(
    (c) =>
      c.nome.toLowerCase() === normalized ||
      c.label.toLowerCase() === normalized ||
      `${c.nome} (${c.sigla})`.toLowerCase() === normalized
  );
}
