// src/app/api/test-stripe/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    
    if (!key) {
      return NextResponse.json({
        error: 'STRIPE_SECRET_KEY non configurata',
        hasKey: false
      }, { status: 500 });
    }
    
    // Test connessione Stripe
    const stripe = new Stripe(key, {
      apiVersion: '2025-06-30.basil',
    });
    
    // Prova a fare una chiamata semplice
    const account = await stripe.accounts.retrieve();
    
    return NextResponse.json({
      success: true,
      hasKey: true,
      keyPrefix: key.substring(0, 7),
      accountId: account.id,
    });
    
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      hasKey: !!process.env.STRIPE_SECRET_KEY
    }, { status: 500 });
  }
}