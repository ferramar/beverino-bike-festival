"use client"
import React, { useState, useEffect, useRef } from 'react';
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
import DataForm from '../dataForm';
import Liberatoria from '../Liberatoria';
import FinalRegistrationStep from '../FinalRegistrationStep';
import CheckoutRedirectStep from '../CheckoutRedirectStep';
import { customAlphabet } from 'nanoid';
import { OrangeStepper } from '../CustomStepper';
import { calculateOrderTotal } from '../../config/pricing';

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
  activeStep?: number;
}

const steps = ['Opzioni', 'Dati Personali', 'Liberatoria', 'Pagamento'];
const SESSION_KEY = 'beverino_registration_session';
const SESSION_TTL = 24 * 60 * 60 * 1000; // 24 ore
const MAX_STEP = steps.length - 1;

function sanitizeRestoredStep(step: number, registrationId: number | null): number {
  if (!Number.isFinite(step) || step < 0 || step > MAX_STEP) return 0;
  if (step === MAX_STEP && !registrationId) return MAX_STEP - 1;
  return step;
}

export default function IscrizioneWizard() {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nanoid = customAlphabet(alphabet, 10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const methods = useForm<WizardData>({
    mode: 'onTouched',
    defaultValues: {},
  });
  const { watch, trigger, reset, setValue, getValues } = methods;
  const [activeStep, setActiveStep] = useState(0);
  const [userAgent, setUserAgent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationId, setRegistrationId] = useState<number | null>(null);
  const [codiceRegistrazione, setCodiceRegistrazione] = useState<string>('');
  const [sessionToken, setSessionToken] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showError, setShowError] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isSessionReady, setIsSessionReady] = useState(false);

  // Calcola il totale in base alla gara e pasta party
  useEffect(() => {
    const tipoGara = watch('tipo_gara');
    const pastaPartyCount = watch('conteggio_pastaparty') || 0;
    const total = calculateOrderTotal(tipoGara, pastaPartyCount);
    
    setTotalAmount(total);
  }, [watch('tipo_gara'), watch('conteggio_pastaparty')]);

  // Invalida liberatoria se l'utente cambia tipo di gara (tornando allo step Opzioni)
  const tipoGara = watch('tipo_gara');
  const prevTipoGaraRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (
      prevTipoGaraRef.current &&
      prevTipoGaraRef.current !== tipoGara &&
      tipoGara
    ) {
      setValue('liberatoriaAccettata', false, { shouldValidate: false });
      setValue('liberatoriaPdfBlob', undefined, { shouldValidate: false });
    }
    prevTipoGaraRef.current = tipoGara;
  }, [tipoGara, setValue]);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setUserAgent(navigator.userAgent);
    }
  }, []);

  // Ripristina sessione (token, iscrizione Strapi, step corrente)
  useEffect(() => {
    const storedSession = localStorage.getItem(SESSION_KEY);
    let nextToken = nanoid();
    let nextRegistrationId: number | null = null;
    let nextCodice = '';
    let nextStep = 0;

    if (storedSession) {
      try {
        const session: SessionData = JSON.parse(storedSession);
        const now = Date.now();

        if (now - session.createdAt < session.ttl) {
          nextToken = session.token;
          nextRegistrationId = session.registrationId ?? null;
          nextCodice = session.codiceRegistrazione || '';
          nextStep = sanitizeRestoredStep(session.activeStep ?? 0, nextRegistrationId);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      } catch {
        // sessione corrotta: nuovo token
      }
    }

    setSessionToken(nextToken);
    setRegistrationId(nextRegistrationId);
    setCodiceRegistrazione(nextCodice);
    setActiveStep(nextStep);
    setIsSessionReady(true);
  }, []);

  // Salva sessione quando cambiano token, iscrizione o step
  useEffect(() => {
    if (!sessionToken) return;

    let createdAt = Date.now();
    const storedSession = localStorage.getItem(SESSION_KEY);
    if (storedSession) {
      try {
        const prev: SessionData = JSON.parse(storedSession);
        if (prev.token === sessionToken && prev.createdAt) {
          createdAt = prev.createdAt;
        }
      } catch {
        // ignora
      }
    }

    const sessionData: SessionData = {
      token: sessionToken,
      createdAt,
      ttl: SESSION_TTL,
      activeStep,
      ...(registrationId ? { registrationId } : {}),
      ...(codiceRegistrazione ? { codiceRegistrazione } : {}),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  }, [sessionToken, registrationId, codiceRegistrazione, activeStep]);

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

  // Validazione per step (0: Opzioni, 1: Dati, 2: Liberatoria, 3: Pagamento)
  const fieldsPerStep: Record<number, (keyof WizardData)[]> = {
    0: ['tipo_gara'],
    1: [
      'nome', 'cognome', 'luogoNascita', 'dataNascita',
      'comuneResidenza', 'residenza', 'numeroCivico', 'cap', 'email',
      'tipoDocumento', 'numeroDocumento', 'cittaRilascio', 'dataRilascioDocumento',
      'nomeGenitore', 'cognomeGenitore', 'luogoNascitaGenitore', 'dataNascitaGenitore',
      'comuneResidenzaGenitore', 'viaResidenzaGenitore', 'numeroCivicoGenitore', 'capGenitore',
      'emailGenitore', 'tipoDocumentoGenitore', 'numeroDocumentoGenitore',
      'cittaRilascioGenitore', 'dataRilascioDocumentoGenitore',
    ],
    2: ['liberatoriaAccettata'],
    3: [],
  };

  const onNext = async () => {
    const baseToValidate = fieldsPerStep[activeStep];
    let toValidate = baseToValidate;

    if (activeStep === 0) {
      const selectedGara = getValues('tipo_gara');
      if (selectedGara === 'ciclistica') {
        toValidate = [...baseToValidate, 'taglia_maglietta'];
      }
    }

    if (!(await trigger(toValidate))) return;

    // Dopo liberatoria accettata: salva su Strapi prima del pagamento
    if (activeStep === 2) {
      const saved = await saveRegistrationToStrapi();
      if (!saved) return;
    }

    setActiveStep((s) => s + 1);
  };

  const onBack = () => {
    setActiveStep(s => s - 1);
  };

  const saveRegistrationToStrapi = async (): Promise<boolean> => {
    setIsSubmitting(true);
    setErrorMessage('');
    setShowError(false);

    try {
      const data = getValues();
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
            return true;
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
      return true;

    } catch (error: unknown) {
      console.error('Errore:', error);
      setErrorMessage('Errore durante il salvataggio. Riprova.');
      setShowError(true);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting;

  if (!isSessionReady) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }} color="text.secondary">
          Caricamento iscrizione...
        </Typography>
      </Container>
    );
  }

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
          {activeStep === 0 && <FinalRegistrationStep />}
          {activeStep === 1 && <DataForm />}
          {activeStep === 2 && <Liberatoria />}
          {activeStep === 3 && registrationId && (
            <CheckoutRedirectStep
              totalAmount={totalAmount}
              registrationId={registrationId}
              codiceRegistrazione={codiceRegistrazione}
              tipoGara={watch('tipo_gara')}
              pastaPartyCount={watch('conteggio_pastaparty')}
            />
          )}
          {activeStep === 3 && !registrationId && !isSubmitting && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Impossibile procedere al pagamento: iscrizione non salvata. Torna indietro e riprova.
            </Alert>
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