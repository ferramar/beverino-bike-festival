"use client"
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Container,
  Typography,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import DataForm from '../dataForm';
import Liberatoria from '../Liberatoria';
import FinalRegistrationStep from '../FinalRegistrationStep';
import { customAlphabet } from 'nanoid';
import { useStripeCheckout } from '../../hooks/useStripeCheckout';
import { OrangeStepper } from '../CustomStepper';

interface WizardData {
  nome: string;
  cognome: string;
  luogoNascita: string;
  dataNascita: string;
  residenza: string;
  numeroCivico: string;
  cap: string;
  email: string;
  tipoDocumento: string;
  numeroDocumento: string;
  cittaRilascio: string;
  dataRilascioDocumento: string;
  liberatoriaAccettata: boolean;
  liberatoriaPdfBlob?: Blob;
  conteggio_pastaparty: number;
}

const steps = ['Dati Personali', 'Liberatoria', 'Pagamento'];

export default function IscrizioneWizard() {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nanoid = customAlphabet(alphabet, 10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const methods = useForm<WizardData>({
    mode: 'onTouched',
    defaultValues: {},
  });
  const { watch, trigger, handleSubmit, reset } = methods;
  const [activeStep, setActiveStep] = useState(0);
  const [userAgent, setUserAgent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationId, setRegistrationId] = useState<number | null>(null);
  
  const { createCheckoutSession, loading: stripeLoading } = useStripeCheckout();

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setUserAgent(navigator.userAgent);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Carica dati salvati dal localStorage
    const stored = localStorage.getItem('iscrizione');
    if (stored) {
      try {
        reset(JSON.parse(stored));
      } catch {
        console.warn('Dati in localStorage non validi');
      }
    }
    
    // Salva automaticamente i cambiamenti
    const subscription = watch((value) => {
      localStorage.setItem('iscrizione', JSON.stringify(value));
    });
    
    return () => subscription.unsubscribe();
  }, [watch, reset]);

  // Validazione per step
  const fieldsPerStep: Record<number, (keyof WizardData)[]> = {
    0: [
      'nome', 'cognome', 'luogoNascita', 'dataNascita',
      'residenza', 'numeroCivico', 'cap', 'email',
      'tipoDocumento', 'numeroDocumento', 'cittaRilascio', 'dataRilascioDocumento'
    ],
    1: ['liberatoriaAccettata'],
    2: ['conteggio_pastaparty'],
  };

  const onNext = async () => {
    const toValidate = fieldsPerStep[activeStep];
    if (await trigger(toValidate)) {
      setActiveStep(s => s + 1);
    }
  };

  const onBack = () => {
    setActiveStep(s => s - 1);
  };

  const saveRegistrationToStrapi = async (data: WizardData) => {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    const codice_registrazione = nanoid();

    // Ottieni IP utente
    let userIp = 'unknown';
    try {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        userIp = ipData.ip;
      }
    } catch {
      // IP non critico, continua senza
    }

    // Upload PDF liberatoria
    let pdfId = null;
    if (data.liberatoriaPdfBlob) {
      const formData = new FormData();
      const fileName = `liberatoria_${data.nome}_${data.cognome}.pdf`;
      formData.append('files', data.liberatoriaPdfBlob, fileName);

      try {
        const uploadResponse = await fetch(`${strapiUrl}/api/upload`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          pdfId = uploadResult[0]?.id;
        }
      } catch {
        // Upload PDF non critico, continua senza
      }
    }

    const log_firma_liberatoria = {
      orario_firmatario: new Date().toISOString(),
      ip_firmatario: userIp,
      user_agent_firmatario: userAgent
    };

    const payload = {
      nome: data.nome,
      cognome: data.cognome,
      luogoNascita: data.luogoNascita,
      dataNascita: data.dataNascita,
      residenza: data.residenza,
      numeroCivico: data.numeroCivico,
      cap: data.cap,
      email: data.email,
      tipoDocumento: data.tipoDocumento,
      numeroDocumento: data.numeroDocumento,
      cittaRilascio: data.cittaRilascio,
      dataRilascioDocumento: data.dataRilascioDocumento,
      liberatoriaAccettata: data.liberatoriaAccettata,
      conteggio_pastaparty: data.conteggio_pastaparty,
      codice_registrazione,
      log_firma_liberatoria,
      pasta_party: data.conteggio_pastaparty > 0,
      stato_pagamento: 'in_attesa',
      ...(pdfId && { liberatoriaPdf: pdfId }),
    };

    const response = await fetch(`${strapiUrl}/api/iscrizionis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: payload }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Errore salvataggio: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result.data.id;
  };

  const onSubmit = async (data: WizardData) => {
    setIsSubmitting(true);

    try {
      // Salva iscrizione in Strapi
      const newRegistrationId = await saveRegistrationToStrapi(data);
      setRegistrationId(newRegistrationId);

      // Procedi con pagamento Stripe
      const includeCena = data.conteggio_pastaparty > 0;
      await createCheckoutSession(newRegistrationId, includeCena, data.conteggio_pastaparty);

    } catch (error: any) {
      console.error('Errore durante l\'iscrizione:', error);
      alert(`Si è verificato un errore: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || stripeLoading;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
        Iscriviti al Beverino Bike Festival
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Compila il form e procedi con le istruzioni per confermare la tua partecipazione.
      </Typography>

      {!isMobile && (
        <OrangeStepper activeStep={activeStep} steps={steps}></OrangeStepper>
      )}

      <FormProvider {...methods}>
        <Box sx={{ mb: 4 }}>
          {activeStep === 0 && <DataForm />}
          {activeStep === 1 && <Liberatoria />}
          {activeStep === 2 && <FinalRegistrationStep />}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            disabled={activeStep === 0 || isLoading}
            onClick={onBack}
            variant="outlined"
          >
            Indietro
          </Button>

          {isMobile && <Typography>{activeStep + 1}/{steps.length}</Typography>}

          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={onNext}
              disabled={isLoading}
            >
              Avanti
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isLoading ? 'Elaborazione...' : 'Conferma e Paga'}
            </Button>
          )}
        </Box>
      </FormProvider>
    </Container>
  );
}