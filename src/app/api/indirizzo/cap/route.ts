import { NextRequest, NextResponse } from 'next/server';
import { localityFromAddress, nominatimSearch } from '@/utils/nominatim';

export async function POST(request: NextRequest) {
  try {
    const { comune, via, civico } = await request.json();

    if (!comune?.trim() || !via?.trim() || !civico?.trim()) {
      return NextResponse.json({ found: false, cap: null });
    }

    const street = `${via.trim()} ${civico.trim()}`;

    const results = await nominatimSearch({
      street,
      city: comune.trim(),
      country: 'Italy',
    });

    const match = results.find((r) => {
      const loc = localityFromAddress(r.address).toLowerCase();
      return loc.includes(comune.trim().toLowerCase()) || comune.trim().toLowerCase().includes(loc);
    });

    const cap = match?.address?.postcode ?? results[0]?.address?.postcode ?? null;

    if (!cap) {
      return NextResponse.json({ found: false, cap: null });
    }

    return NextResponse.json({ found: true, cap });
  } catch (error) {
    console.error('Errore lookup CAP:', error);
    return NextResponse.json({ found: false, cap: null }, { status: 500 });
  }
}
