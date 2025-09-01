// src/app/api/generate-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createLiberatoriaPDF } from '@/components/Liberatoria/LiberatoriaPDF';

export async function POST(request: NextRequest) {
  try {
    // Ottieni i dati dal body della richiesta
    const data = await request.json();
    
    // Validazione base dei dati obbligatori
    if (!data.nome || !data.cognome) {
      console.error('Dati obbligatori mancanti:', { nome: data.nome, cognome: data.cognome });
      return NextResponse.json(
        { 
          error: 'Nome e cognome sono obbligatori per generare il PDF',
          code: 'ERR_MISSING_REQUIRED_FIELDS'
        },
        { status: 400 }
      );
    }
    
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
    
    // Log più dettagliato per debugging
    if (error instanceof Error) {
      console.error('Dettagli errore:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    
    return NextResponse.json(
      { 
        error: 'Errore durante la generazione del PDF',
        details: error instanceof Error ? error.message : 'Errore sconosciuto',
        code: 'ERR_PDF_GENERATION'
      },
      { status: 500 }
    );
  }
}