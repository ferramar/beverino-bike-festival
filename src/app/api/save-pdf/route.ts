// src/app/api/save-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pdfBase64, fileName } = body;
    
    // Rimuovi il prefisso data:application/pdf;base64,
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    
    // Converti base64 in Buffer
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Crea FormData per upload su Strapi
    const formData = new FormData();
    const blob = new Blob([buffer], { type: 'application/pdf' });
    formData.append('files', blob, fileName);
    
    // Se Strapi supporta la specifica della cartella via FormData
    formData.append('folder', 'liberatorie');
    
    // Upload su Strapi
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    const uploadResponse = await fetch(`${strapiUrl}/api/upload`, {
      method: 'POST',
      body: formData,
      // Se serve autenticazione per upload
      // headers: {
      //   'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
      // }
    });
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Errore upload Strapi:', errorText);
      throw new Error(`Upload fallito: ${uploadResponse.status}`);
    }
    
    const uploadResult = await uploadResponse.json();
    
    if (!uploadResult || uploadResult.length === 0) {
      throw new Error('Nessun file restituito da Strapi');
    }
    
    // Prendi il primo file caricato
    const uploadedFile = uploadResult[0];
    
    // Costruisci l'URL completo
    const fileUrl = uploadedFile.url?.startsWith('http') 
      ? uploadedFile.url 
      : `${strapiUrl}${uploadedFile.url}`;
    
    console.log('PDF salvato su Strapi:', {
      id: uploadedFile.id,
      url: fileUrl,
      name: uploadedFile.name
    });
    
    return NextResponse.json({ 
      success: true,
      url: fileUrl,
      fileId: uploadedFile.id,
      fileName: uploadedFile.name
    });
  } catch (error) {
    console.error('Errore salvataggio PDF su Strapi:', error);
    return NextResponse.json(
      { error: 'Errore durante il salvataggio del PDF' },
      { status: 500 }
    );
  }
}