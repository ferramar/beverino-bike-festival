import { NextRequest, NextResponse } from 'next/server';
import {
  localityFromAddress,
  normalizeStreetName,
  nominatimSearch,
} from '@/utils/nominatim';

export async function GET(request: NextRequest) {
  const comune = request.nextUrl.searchParams.get('comune')?.trim();
  const q = request.nextUrl.searchParams.get('q')?.trim();

  if (!comune || !q || q.length < 2) {
    return NextResponse.json({ vie: [] });
  }

  try {
    const results = await nominatimSearch({
      q: `${q}, ${comune}, Italia`,
    });

    const comuneLower = comune.toLowerCase();
    const vie = new Map<string, string>();

    for (const result of results) {
      const road = result.address?.road;
      const loc = localityFromAddress(result.address).toLowerCase();
      if (!road) continue;
      if (loc && !loc.includes(comuneLower) && !comuneLower.includes(loc)) continue;

      const key = normalizeStreetName(road);
      if (!vie.has(key)) vie.set(key, road);
    }

    return NextResponse.json({ vie: Array.from(vie.values()).slice(0, 12) });
  } catch (error) {
    console.error('Errore suggest vie:', error);
    return NextResponse.json({ vie: [] }, { status: 500 });
  }
}
