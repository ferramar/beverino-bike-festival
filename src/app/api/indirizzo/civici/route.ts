import { NextRequest, NextResponse } from 'next/server';
import { localityFromAddress, nominatimSearch } from '@/utils/nominatim';

function sortCivico(a: string, b: string): number {
  const na = parseInt(a.replace(/\D/g, ''), 10) || 0;
  const nb = parseInt(b.replace(/\D/g, ''), 10) || 0;
  if (na !== nb) return na - nb;
  return a.localeCompare(b, 'it');
}

export async function GET(request: NextRequest) {
  const comune = request.nextUrl.searchParams.get('comune')?.trim();
  const via = request.nextUrl.searchParams.get('via')?.trim();

  if (!comune || !via || via.length < 2) {
    return NextResponse.json({ civici: [] });
  }

  try {
    const results = await nominatimSearch({
      street: via,
      city: comune,
      country: 'Italy',
    });

    const comuneLower = comune.toLowerCase();
    const civici = new Set<string>();

    for (const result of results) {
      const num = result.address?.house_number;
      const loc = localityFromAddress(result.address).toLowerCase();
      if (!num) continue;
      if (loc && !loc.includes(comuneLower) && !comuneLower.includes(loc)) continue;
      civici.add(num);
    }

    return NextResponse.json({
      civici: Array.from(civici).sort(sortCivico).slice(0, 30),
    });
  } catch (error) {
    console.error('Errore suggest civici:', error);
    return NextResponse.json({ civici: [] }, { status: 500 });
  }
}
