// src/app/api/generate-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createLiberatoriaPDF } from '@/components/Liberatoria/LiberatoriaPDF';

export async function POST(request: NextRequest) {
  try {
    // Ottieni i dati dal body della richiesta
    const data = await request.json();
    
    // Genera il PDF usando la funzione helper
    const document = createLiberatoriaPDF(data);
    const pdfBuffer = await renderToBuffer(document);

    // Restituisci il PDF come risposta
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="liberatoria_${data.nome}_${data.cognome}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Errore generazione PDF:', error);
    return NextResponse.json(
      { error: 'Errore durante la generazione del PDF' },
      { status: 500 }
    );
  }
}