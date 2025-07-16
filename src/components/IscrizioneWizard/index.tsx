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
  Snackbar,
  Alert,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import DataForm from '../dataForm';
import Liberatoria from '../Liberatoria';
import FinalRegistrationStep from '../FinalRegistrationStep';
import PaymentStep from '../PaymentStep';
import { customAlphabet } from 'nanoid';
import { useStripeCheckout } from '../../hooks/useStripeCheckout';
import { OrangeStepper } from '../CustomStepper';

interface DatiGenitore {
  nome: string;
  cognome: string;
  luogoNascita: string;
  dataNascita: string;
  comuneResidenza: string;
  viaResidenza: string;
  numeroCivico: string;
  cap: string;
  email: string;
  tipoDocumento: string;
  numeroDocumento: string;
  cittaRilascio: string;
  dataRilascioDocumento: string;
}

interface WizardData {
  nome: string;
  cognome: string;
  luogoNascita: string;
  dataNascita: string;
  comuneResidenza: string;
  residenza: string;
  numeroCivico: string;
  cap: string;
  email: string;
  tipoDocumento: string;
  numeroDocumento: string;
  cittaRilascio: string;
  dataRilascioDocumento: string;
  nomeGenitore?: string;
  cognomeGenitore?: string;
  luogoNascitaGenitore?: string;
  dataNascitaGenitore?: string;
  comuneResidenzaGenitore?: string;
  viaResidenzaGenitore?: string;
  numeroCivicoGenitore?: string;
  capGenitore?: string;
  emailGenitore?: string;
  tipoDocumentoGenitore?: string;
  numeroDocumentoGenitore?: string;
  cittaRilascioGenitore?: string;
  dataRilascioDocumentoGenitore?: string;
  nomeTutore?: string;
  cognomeTutore?: string;
  liberatoriaAccettata: boolean;
  liberatoriaPdfBlob?: Blob;
  tipo_gara: 'ciclistica' | 'running' | '';
  conteggio_pastaparty: number;
  pasta_party_enabled: boolean;
  taglia_maglietta?: string;
}

interface SessionData {
  token: string;
  createdAt: number;
  ttl: number;
  registrationId?: number;
  codiceRegistrazione?: string;
}

const steps = ['Dati Personali', 'Liberatoria', 'Opzioni', 'Pagamento'];
const SESSION_KEY = 'beverino_registration_session';
const SESSION_TTL = 24 * 60 * 60 * 1000; // 24 ore

export default function IscrizioneWizard() {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nanoid = customAlphabet(alphabet, 10);
  const theme = useTheme();
  const router = useRouter();
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
  const [codiceRegistrazione, setCodiceRegistrazione] = useState<string>('');
  const [sessionToken, setSessionToken] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showError, setShowError] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const { createCheckoutSession, loading: stripeLoading } = useStripeCheckout();

  // Calcola il totale in base alla gara e pasta party
  useEffect(() => {
    const tipoGara = watch('tipo_gara');
    const pastaPartyCount = watch('conteggio_pastaparty') || 0;
    
    let racePrice = 0;
    if (tipoGara === 'ciclistica') racePrice = 20;
    else if (tipoGara === 'running') racePrice = 10;
    
    const pastaPrice = pastaPartyCount * 12;
    const total = racePrice + pastaPrice;
    
    console.log('Calcolo totale:', {
      tipoGara,
      racePrice,
      pastaPartyCount,
      pastaPrice,
      total
    });
    
    setTotalAmount(total);
  }, [watch('tipo_gara'), watch('conteggio_pastaparty')]);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setUserAgent(navigator.userAgent);
    }
  }, []);

  // Gestione session token
  useEffect(() => {
    const storedSession = localStorage.getItem(SESSION_KEY);

    if (storedSession) {
      try {
        const session: SessionData = JSON.parse(storedSession);
        const now = Date.now();

        if (now - session.createdAt < session.ttl) {
          setSessionToken(session.token);
          setRegistrationId(session.registrationId || null);
          setCodiceRegistrazione(session.codiceRegistrazione || '');
        } else {
          localStorage.removeItem(SESSION_KEY);
          const newToken = nanoid();
          setSessionToken(newToken);
        }
      } catch {
        const newToken = nanoid();
        setSessionToken(newToken);
      }
    } else {
      const newToken = nanoid();
      setSessionToken(newToken);
    }
  }, []);

  // Salva sessione quando cambia
  useEffect(() => {
    if (sessionToken) {
      const sessionData: SessionData = {
        token: sessionToken,
        createdAt: Date.now(),
        ttl: SESSION_TTL,
        registrationId: registrationId || undefined,
        codiceRegistrazione: codiceRegistrazione || undefined
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    }
  }, [sessionToken, registrationId, codiceRegistrazione]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('iscrizione');
    if (stored) {
      try {
        reset(JSON.parse(stored));
      } catch {
        console.warn('Dati in localStorage non validi');
      }
    }

    const subscription = watch((value) => {
      localStorage.setItem('iscrizione', JSON.stringify(value));
    });

    return () => subscription.unsubscribe();
  }, [watch, reset]);

  // Validazione per step
  const fieldsPerStep: Record<number, (keyof WizardData)[]> = {
    0: [
      'nome', 'cognome', 'luogoNascita', 'dataNascita',
      'comuneResidenza', 'residenza', 'numeroCivico', 'cap', 'email',
      'tipoDocumento', 'numeroDocumento', 'cittaRilascio', 'dataRilascioDocumento',
      // Campi genitore (validati solo se minore)
      'nomeGenitore', 'cognomeGenitore', 'luogoNascitaGenitore', 'dataNascitaGenitore',
      'comuneResidenzaGenitore', 'viaResidenzaGenitore', 'numeroCivicoGenitore', 'capGenitore',
      'emailGenitore', 'tipoDocumentoGenitore', 'numeroDocumentoGenitore',
      'cittaRilascioGenitore', 'dataRilascioDocumentoGenitore'
    ],
    1: ['liberatoriaAccettata'],
    2: ['tipo_gara', 'taglia_maglietta'],
    3: [], // Step pagamento non ha campi da validare
  };

  const onNext = async () => {
    const toValidate = fieldsPerStep[activeStep];
    if (await trigger(toValidate)) {
      // Se siamo allo step 2 (opzioni), salva i dati su Strapi prima del pagamento
      if (activeStep === 2) {
        await saveRegistrationToStrapi();
      }
      setActiveStep(s => s + 1);
    }
  };

  const onBack = () => {
    setActiveStep(s => s - 1);
  };

  const saveRegistrationToStrapi = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    setShowError(false);

    try {
      const data = methods.getValues();
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

      // Usa il codice esistente se c'è, altrimenti genera nuovo
      let codice_registrazione = codiceRegistrazione || nanoid();

      // Ottieni IP utente
      let userIp = 'unknown';
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          userIp = ipData.ip;
        }
      } catch {
        // IP non critico
      }

      // Salva PDF sul server
      let pdfUrl = null;
      if (data.liberatoriaPdfBlob) {
        try {
          const reader = new FileReader();
          const base64 = await new Promise<string>((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(data.liberatoriaPdfBlob!);
          });

          const saveResponse = await fetch('/api/save-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pdfBase64: base64,
              fileName: `liberatoria_${data.nome}_${data.cognome}_${Date.now()}.pdf`,
            }),
          });

          if (saveResponse.ok) {
            const result = await saveResponse.json();
            pdfUrl = result.url;
          }
        } catch (error) {
          console.error('Errore salvataggio PDF:', error);
        }
      }

      const log_firma_liberatoria = {
        orario_firmatario: new Date().toISOString(),
        ip_firmatario: userIp,
        user_agent_firmatario: userAgent
      };

      // Prepara i dati del genitore
      let dati_genitore = null;
      if (data.nomeGenitore) {
        dati_genitore = {
          nome: data.nomeGenitore,
          cognome: data.cognomeGenitore || '',
          luogoNascita: data.luogoNascitaGenitore || '',
          dataNascita: data.dataNascitaGenitore || '',
          comuneResidenza: data.comuneResidenzaGenitore || '',
          viaResidenza: data.viaResidenzaGenitore || '',
          numeroCivico: data.numeroCivicoGenitore || '',
          cap: data.capGenitore || '',
          email: data.emailGenitore || '',
          tipoDocumento: data.tipoDocumentoGenitore || '',
          numeroDocumento: data.numeroDocumentoGenitore || '',
          cittaRilascio: data.cittaRilascioGenitore || '',
          dataRilascioDocumento: data.dataRilascioDocumentoGenitore || ''
        };
      }

      const payload = {
        nome: data.nome,
        cognome: data.cognome,
        luogoNascita: data.luogoNascita,
        dataNascita: data.dataNascita,
        comuneResidenza: data.comuneResidenza,
        residenza: data.residenza,
        numeroCivico: data.numeroCivico,
        cap: data.cap,
        email: data.email,
        tipoDocumento: data.tipoDocumento,
        numeroDocumento: data.numeroDocumento,
        cittaRilascio: data.cittaRilascio,
        dataRilascioDocumento: data.dataRilascioDocumento,
        dati_genitore,
        nomeTutore: data.nomeTutore || null,
        cognomeTutore: data.cognomeTutore || null,
        tipo_gara: data.tipo_gara,
        liberatoriaAccettata: data.liberatoriaAccettata,
        conteggio_pastaparty: data.conteggio_pastaparty,
        taglia_maglietta: data.taglia_maglietta || null,
        codice_registrazione,
        log_firma_liberatoria,
        pasta_party: data.conteggio_pastaparty > 0,
        stato_pagamento: 'in_attesa',
        liberatoriaPdfUrl: pdfUrl,
        session_token: sessionToken,
        publishedAt: new Date().toISOString()
      };

      // Controlla se esiste già un'iscrizione con questo token
      try {
        const checkResponse = await fetch(
          `${strapiUrl}/api/iscrizionis?filters[session_token][$eq]=${sessionToken}`,
          { method: 'GET', headers: { 'Content-Type': 'application/json' } }
        );

        if (checkResponse.ok) {
          const checkData = await checkResponse.json();

          if (checkData.data && checkData.data.length > 0) {
            // Esiste già, aggiorna
            const existingRegistration = checkData.data[0];
            const updateId = existingRegistration.documentId || existingRegistration.id;
            codice_registrazione = existingRegistration.codice_registrazione;

            const updateResponse = await fetch(`${strapiUrl}/api/iscrizionis/${updateId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: { ...payload, codice_registrazione } }),
            });

            if (!updateResponse.ok) {
              throw new Error('Errore aggiornamento iscrizione');
            }

            const result = await updateResponse.json();
            setRegistrationId(result.data.id);
            setCodiceRegistrazione(codice_registrazione);
            return;
          }
        }
      } catch (error) {
        console.error('Errore check duplicati:', error);
      }

      // Crea nuova iscrizione
      const response = await fetch(`${strapiUrl}/api/iscrizionis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { ...payload, codice_registrazione } }),
      });

      if (!response.ok) {
        throw new Error('Errore salvataggio iscrizione');
      }

      const result = await response.json();
      setRegistrationId(result.data.id);
      setCodiceRegistrazione(codice_registrazione);

    } catch (error: any) {
      console.error('Errore:', error);
      setErrorMessage('Errore durante il salvataggio. Riprova.');
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Pulisci localStorage
    localStorage.removeItem('iscrizione');
    localStorage.removeItem(SESSION_KEY);
    // Redirect alla pagina di conferma
    router.push('/conferma');
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
        <OrangeStepper activeStep={activeStep} steps={steps} />
      )}

      <FormProvider {...methods}>
        <Box sx={{ mb: 4 }}>
          {activeStep === 0 && <DataForm />}
          {activeStep === 1 && <Liberatoria />}
          {activeStep === 2 && <FinalRegistrationStep />}
          {activeStep === 3 && registrationId && (
            <PaymentStep 
              totalAmount={totalAmount}
              onSuccess={handlePaymentSuccess}
              registrationId={registrationId}
              codiceRegistrazione={codiceRegistrazione}
              tipoGara={watch('tipo_gara')}
              pastaPartyCount={watch('conteggio_pastaparty')}
              userEmail={watch('email')}
            />
          )}
        </Box>

        {/* Bottoni navigazione */}
        {activeStep < 4 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              disabled={activeStep === 0 || isLoading}
              onClick={onBack}
              variant="outlined"
            >
              Indietro
            </Button>

            {isMobile && <Typography>{activeStep + 1}/{steps.length}</Typography>}

            {activeStep < 3 && (
              <Button
                variant="contained"
                onClick={onNext}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isLoading ? 'Salvataggio...' : 'Avanti'}
              </Button>
            )}
          </Box>
        )}

        {/* Fallback a Stripe Checkout se preferisci */}
        {/* {activeStep === 3 && registrationId && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Problemi con il form di pagamento?
            </Typography>
            <Button
              variant="text"
              onClick={async () => {
                try {
                  await createCheckoutSession(
                    registrationId,
                    watch('conteggio_pastaparty') > 0,
                    watch('conteggio_pastaparty'),
                    codiceRegistrazione,
                    watch('tipo_gara')
                  );
                } catch (error) {
                  // Errore già gestito
                }
              }}
              disabled={stripeLoading}
            >
              Usa pagamento con redirect
            </Button>
          </Box>
        )} */}
      </FormProvider>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowError(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}