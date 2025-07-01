import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pdfBase64, fileName } = body;
    
    // Rimuovi il prefisso data:application/pdf;base64,
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    
    // Crea la directory se non esiste
    const uploadsDir = path.join(process.cwd(), 'public', 'liberatorie');
    await mkdir(uploadsDir, { recursive: true });
    
    // Salva il file
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, base64Data, 'base64');
    
    // Restituisci l'URL pubblico completo
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const publicUrl = `${baseUrl}/liberatorie/${fileName}`;
    
    return NextResponse.json({ 
      success: true,
      url: publicUrl 
    });
  } catch (error) {
    console.error('Errore salvataggio PDF:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
