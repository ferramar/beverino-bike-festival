// app/api/verify-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { ConfermaIscrizioneEmail } from '@/app/emails/conferma-iscrizione';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const resend = new Resend(process.env.RESEND_API_KEY);

// Cache per tracciare le sessioni già processate
const processedSessions = new Set<string>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID mancante' }, { status: 400 });
  }

  // Previeni elaborazioni multiple della stessa sessione
  if (processedSessions.has(sessionId)) {
    return NextResponse.json({
      status: 'complete',
      payment_status: 'paid',
      message: 'Già processato'
    });
  }

  try {
    // Marca la sessione come processata
    processedSessions.add(sessionId);
    
    // 1. Verifica il pagamento con Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer']
    });
        
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ 
        error: 'Pagamento non completato',
        status: session.status,
        payment_status: session.payment_status,
      }, { status: 400 });
    }

    // 2. Recupera i dati dell'iscrizione da Strapi usando il codice_registrazione
    const codiceRegistrazione = session.metadata?.codice_registrazione;
    if (!codiceRegistrazione) {
      console.error('Codice registrazione non trovato nei metadata della sessione');
      return NextResponse.json({
        status: session.status,
        payment_status: session.payment_status,
        payment_intent: session.payment_intent,
        amount_total: session.amount_total,
        currency: session.currency,
        warning: 'Email non inviata - codice registrazione non trovato'
      });
    }

    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    
    // Usa il codice_registrazione per trovare l'iscrizione
    const strapiResponse = await fetch(
      `${strapiUrl}/api/iscrizionis?filters[codice_registrazione][$eq]=${codiceRegistrazione}`
    );
    
    if (!strapiResponse.ok) {
      console.error('Errore recupero dati da Strapi:', await strapiResponse.text());
      return NextResponse.json({
        status: session.status,
        payment_status: session.payment_status,
        payment_intent: session.payment_intent,
        amount_total: session.amount_total,
        currency: session.currency,
        warning: 'Email non inviata - errore recupero dati'
      });
    }

    const responseData = await strapiResponse.json();
    
    if (!responseData.data || responseData.data.length === 0) {
      console.error('Nessuna iscrizione trovata con codice:', codiceRegistrazione);
      return NextResponse.json({
        status: session.status,
        payment_status: session.payment_status,
        payment_intent: session.payment_intent,
        amount_total: session.amount_total,
        currency: session.currency,
        warning: 'Email non inviata - iscrizione non trovata'
      });
    }

    const registration = responseData.data[0];
    // In Strapi v5, potrebbe servire il documentId per gli update
    const documentId = registration.documentId;
    const numericId = registration.id;
    
    // 3. Controlla se l'email è già stata inviata
    if (registration.email_conferma_inviata) {
      return NextResponse.json({
        status: session.status,
        payment_status: session.payment_status,
        payment_intent: session.payment_intent,
        amount_total: session.amount_total,
        currency: session.currency,
        email_sent: false,
        message: 'Email già inviata in precedenza'
      });
    }

    // 4. Prepara i dati per l'email usando solo i dati da Strapi
    const emailData = {
      nome: registration.nome,
      cognome: registration.cognome,
      includesPastaParty: registration.pasta_party || false,
      numeroPartecipantiPastaParty: registration.conteggio_pastaparty || 0,
      importoTotale: (session.amount_total || 0) / 100,
      codiceRegistrazione: registration.codice_registrazione,
    };

    // 5. Invia l'email
    try {
      const { data: emailResult, error: emailError } = await resend.emails.send({
        from: 'Beverino Bike Festival <noreply@beverinobikefestival.com>',
        to: [registration.email],
        subject: `Conferma Iscrizione - Beverino Bike Festival`,
        react: ConfermaIscrizioneEmail(emailData),
      });

      if (emailError) {
        console.error('Errore invio email:', emailError);
        throw emailError;
      }


      // 6. Aggiorna Strapi - in v5 potrebbe servire il documentId
      
      // Prima prova con documentId (Strapi v5)
      let updateResponse = await fetch(`${strapiUrl}/api/iscrizionis/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            email_conferma_inviata: true,
            data_invio_email_conferma: new Date().toISOString(),
            id_email_resend: emailResult?.id,
            stato_pagamento: 'completato',
          }
        })
      });

      if (!updateResponse.ok && updateResponse.status === 404) {
        // Se fallisce, prova con l'ID numerico
        updateResponse = await fetch(`${strapiUrl}/api/iscrizionis/${numericId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              email_conferma_inviata: true,
              data_invio_email_conferma: new Date().toISOString(),
              id_email_resend: emailResult?.id,
              stato_pagamento: 'completato',
            }
          })
        });
      }

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error('Errore aggiornamento Strapi:', errorText);
      } else {
        console.log('Aggiornamento Strapi completato con successo');
      }

      // 7. Restituisci la risposta di successo
      return NextResponse.json({
        status: session.status,
        payment_status: session.payment_status,
        payment_intent: session.payment_intent,
        amount_total: session.amount_total,
        currency: session.currency,
        email_sent: true,
        email_id: emailResult?.id
      });

    } catch (emailError) {
      console.error('Errore durante invio email:', emailError);
      
      // Aggiorna comunque lo stato del pagamento
      await fetch(`${strapiUrl}/api/iscrizionis/${documentId || numericId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            stato_pagamento: 'completato',
          }
        })
      });
      
      // Registra comunque il pagamento come completato
      return NextResponse.json({
        status: session.status,
        payment_status: session.payment_status,
        payment_intent: session.payment_intent,
        amount_total: session.amount_total,
        currency: session.currency,
        email_sent: false,
        error: 'Errore invio email - contattare assistenza'
      });
    }

  } catch (error) {
    console.error('Errore verifica pagamento:', error);
    return NextResponse.json({ error: 'Errore verifica pagamento' }, { status: 500 });
  }
}