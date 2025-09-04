// app/api/verify-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { ConfermaIscrizioneEmail } from '@/app/emails/conferma-iscrizione';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

const resend = new Resend(process.env.RESEND_API_KEY);

// Cache per tracciare le sessioni/payment già processati
const processedPayments = new Set<string>();

// Funzione helper per inviare email e aggiornare Strapi
async function processPaymentAndSendEmail(
  registration: any,
  amountTotal: number,
  paymentId: string
) {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const documentId = registration.documentId;
  const numericId = registration.id;

  // Prepara i dati per l'email
  const emailData = {
    nome: registration.nome,
    cognome: registration.cognome,
    tipo_gara: registration.tipo_gara,
    includesPastaParty: registration.pasta_party || false,
    numeroPartecipantiPastaParty: registration.conteggio_pastaparty || 0,
    importoTotale: amountTotal / 100,
    codiceRegistrazione: registration.codice_registrazione,
  };

  // Invia l'email
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

    // Aggiorna Strapi
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
          id_pagamento: paymentId,
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
            id_pagamento: paymentId,
          }
        })
      });
    }

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Errore aggiornamento Strapi:', errorText);
    }

    return { success: true, emailId: emailResult?.id };
  } catch (error) {
    console.error('Errore durante processo email:', error);
    
    // Aggiorna comunque lo stato del pagamento
    await fetch(`${strapiUrl}/api/iscrizionis/${documentId || numericId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          stato_pagamento: 'completato',
          id_pagamento: paymentId,
        }
      })
    });
    
    return { success: false, error: 'Errore invio email' };
  }
}

// GET - Per Stripe Checkout (redirect flow)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID mancante' }, { status: 400 });
  }

  // Previeni elaborazioni multiple
  if (processedPayments.has(sessionId)) {
    return NextResponse.json({
      status: 'complete',
      payment_status: 'paid',
      message: 'Già processato'
    });
  }

  try {
    processedPayments.add(sessionId);
    
    // Verifica il pagamento con Stripe
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

    // Recupera i dati dell'iscrizione da Strapi
    const codiceRegistrazione = session.metadata?.codice_registrazione;
    if (!codiceRegistrazione) {
      console.error('Codice registrazione non trovato nei metadata della sessione');
      return NextResponse.json({
        status: session.status,
        payment_status: session.payment_status,
        payment_intent: session.payment_intent,
        amount_total: session.amount_total,
        warning: 'Email non inviata - codice registrazione non trovato'
      });
    }

    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
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
        warning: 'Email non inviata - iscrizione non trovata'
      });
    }

    const registration = responseData.data[0];
    
    // Controlla se l'email è già stata inviata
    if (registration.email_conferma_inviata) {
      return NextResponse.json({
        status: session.status,
        payment_status: session.payment_status,
        payment_intent: session.payment_intent,
        amount_total: session.amount_total,
        email_sent: false,
        message: 'Email già inviata in precedenza'
      });
    }

    // Processa pagamento e invia email
    const result = await processPaymentAndSendEmail(
      registration,
      session.amount_total || 0,
      session.payment_intent as string
    );

    return NextResponse.json({
      status: session.status,
      payment_status: session.payment_status,
      payment_intent: session.payment_intent,
      amount_total: session.amount_total,
      currency: session.currency,
      email_sent: result.success,
      email_id: result.emailId,
      ...(result.error && { error: result.error })
    });

  } catch (error) {
    console.error('Errore verifica pagamento:', error);
    return NextResponse.json({ error: 'Errore verifica pagamento' }, { status: 500 });
  }
}

// POST - Per Stripe Elements (embedded flow)
export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, registrationId, codiceRegistrazione } = await request.json();

    if (!paymentIntentId || (!registrationId && !codiceRegistrazione)) {
      return NextResponse.json({ 
        error: 'PaymentIntent ID e Registration ID/Codice mancanti' 
      }, { status: 400 });
    }

    // Previeni elaborazioni multiple
    if (processedPayments.has(paymentIntentId)) {
      return NextResponse.json({
        success: true,
        email_sent: false,
        message: 'Già processato'
      });
    }

    processedPayments.add(paymentIntentId);

    // Verifica payment intent con Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ 
        error: 'Pagamento non completato',
        status: paymentIntent.status 
      }, { status: 400 });
    }

    // Recupera i dati dell'iscrizione da Strapi
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    let registration = null;
    
    // Prima prova con registrationId se disponibile
    if (registrationId) {
      try {
        const strapiResponse = await fetch(`${strapiUrl}/api/iscrizionis/${registrationId}`);
        
        if (strapiResponse.ok) {
          const responseData = await strapiResponse.json();
          registration = responseData.data;
        }
      } catch (error) {
        console.error('Errore recupero con ID:', error);
      }
    }
    
    // Se non trovato con ID, prova con codice registrazione
    if (!registration && codiceRegistrazione) {
      try {
        const strapiResponse = await fetch(
          `${strapiUrl}/api/iscrizionis?filters[codice_registrazione][$eq]=${codiceRegistrazione}`
        );
        
        if (strapiResponse.ok) {
          const responseData = await strapiResponse.json();
          if (responseData.data && responseData.data.length > 0) {
            registration = responseData.data[0];
          }
        }
      } catch (error) {
        console.error('Errore recupero con codice:', error);
      }
    }

    if (!registration) {
      return NextResponse.json({
        error: 'Iscrizione non trovata',
        success: false,
        email_sent: false
      }, { status: 404 });
    }

    // Controlla se l'email è già stata inviata
    if (registration.email_conferma_inviata) {
      return NextResponse.json({
        success: true,
        email_sent: false,
        message: 'Email già inviata in precedenza'
      });
    }

    // Processa pagamento e invia email
    const result = await processPaymentAndSendEmail(
      registration,
      paymentIntent.amount,
      paymentIntent.id
    );

    return NextResponse.json({
      success: true,
      email_sent: result.success,
      email_id: result.emailId,
      ...(result.error && { error: result.error })
    });

  } catch (error) {
    console.error('Errore verifica pagamento:', error);
    return NextResponse.json({ 
      error: 'Errore verifica pagamento',
      success: false,
      email_sent: false
    }, { status: 500 });
  }
}