const USER_AGENT = 'BeverinoBikeFestival/1.0 (iscrizione evento; contact@beverinobikefestival.it)';

export interface NominatimAddress {
  road?: string;
  house_number?: string;
  postcode?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
}

export interface NominatimResult {
  display_name: string;
  address?: NominatimAddress;
}

export async function nominatimSearch(params: Record<string, string>): Promise<NominatimResult[]> {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'json');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('countrycodes', 'it');
  url.searchParams.set('limit', '10');

  for (const [key, value] of Object.entries(params)) {
    if (value.trim()) url.searchParams.set(key, value.trim());
  }

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': USER_AGENT },
    next: { revalidate: 86400 },
  });

  if (!res.ok) return [];
  return res.json();
}

export function localityFromAddress(address?: NominatimAddress): string {
  if (!address) return '';
  return address.city || address.town || address.village || address.municipality || '';
}

export function normalizeStreetName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}
