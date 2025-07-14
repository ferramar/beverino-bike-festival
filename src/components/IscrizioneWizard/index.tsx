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
import DataForm from '../dataForm';
import Liberatoria from '../Liberatoria';
import FinalRegistrationStep from '../FinalRegistrationStep';
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
}

const steps = ['Dati Personali', 'Liberatoria', 'Pagamento'];
const SESSION_KEY = 'beverino_registration_session';
const SESSION_TTL = 24 * 60 * 60 * 1000; // 24 ore

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
  const [sessionToken, setSessionToken] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showError, setShowError] = useState(false);


  const { createCheckoutSession, loading: stripeLoading } = useStripeCheckout();

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setUserAgent(navigator.userAgent);
    }
  }, []);

  // Gestione session token
  useEffect(() => {
    // Controlla se esiste una sessione valida
    const storedSession = localStorage.getItem(SESSION_KEY);

    if (storedSession) {
      try {
        const session: SessionData = JSON.parse(storedSession);
        const now = Date.now();

        // Verifica se la sessione è ancora valida
        if (now - session.createdAt < session.ttl) {
          setSessionToken(session.token);
          setRegistrationId(session.registrationId || null);
        } else {
          // Sessione scaduta, rimuovi
          localStorage.removeItem(SESSION_KEY);
          const newToken = nanoid();
          setSessionToken(newToken);
        }
      } catch {
        // Token corrotto, genera nuovo
        const newToken = nanoid();
        setSessionToken(newToken);
      }
    } else {
      // Nessuna sessione, genera nuovo token
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
        registrationId: registrationId || undefined
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    }
  }, [sessionToken, registrationId]);

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

  // Validazione per step - includiamo tutti i possibili campi
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

    // Usa il codice esistente se c'è un registrationId, altrimenti genera nuovo
    let codice_registrazione = nanoid();

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

    // Salva PDF sul server Next.js
    let pdfUrl = null;
    if (data.liberatoriaPdfBlob) {
      try {
        // Converti Blob in base64
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(data.liberatoriaPdfBlob!);
        });

        // Salva il PDF sul server Next.js
        const saveResponse = await fetch('/api/save-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pdfBase64: base64,
            fileName: `liberatoria_${data.nome}_${data.cognome}_${Date.now()}.pdf`,
          }),
        });

        if (saveResponse.ok) {
          const result = await saveResponse.json();
          pdfUrl = result.url;
        } else {
          console.error('Errore salvataggio PDF:', await saveResponse.text());
        }
      } catch (error) {
        console.error('Errore durante salvataggio PDF:', error);
        // Salvataggio PDF non critico, continua senza
      }
    }

    const log_firma_liberatoria = {
      orario_firmatario: new Date().toISOString(),
      ip_firmatario: userIp,
      user_agent_firmatario: userAgent
    };

    // Prepara i dati del genitore come componente se presenti
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
      // Dati personali
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
      // Dati genitore come componente
      dati_genitore,
      // Dati tutore
      nomeTutore: data.nomeTutore || null,
      cognomeTutore: data.cognomeTutore || null,
      // Altri dati
      tipo_gara: data.tipo_gara,
      liberatoriaAccettata: data.liberatoriaAccettata,
      conteggio_pastaparty: data.conteggio_pastaparty,
      taglia_maglietta: data.taglia_maglietta || null,
      codice_registrazione,
      log_firma_liberatoria,
      pasta_party: data.conteggio_pastaparty > 0,
      stato_pagamento: 'in_attesa',
      liberatoriaPdfUrl: pdfUrl,
      session_token: sessionToken, // NUOVO CAMPO
      publishedAt: new Date().toISOString()
    };

    // Prima controlla se esiste già un'iscrizione con questo token
    try {
      const checkResponse = await fetch(
        `${strapiUrl}/api/iscrizionis?filters[session_token][$eq]=${sessionToken}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (checkResponse.ok) {
        const checkData = await checkResponse.json();

        if (checkData.data && checkData.data.length > 0) {
          // Esiste già, aggiorna invece di creare
          const existingRegistration = checkData.data[0];
          const updateId = existingRegistration.documentId || existingRegistration.id;

          // Mantieni il codice_registrazione esistente
          codice_registrazione = existingRegistration.codice_registrazione;

          const updateResponse = await fetch(`${strapiUrl}/api/iscrizionis/${updateId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data: {
                ...payload,
                codice_registrazione // Usa quello esistente
              }
            }),
          });

          if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            throw new Error(`Errore aggiornamento: ${updateResponse.status} - ${errorText}`);
          }

          const result = await updateResponse.json();
          return {
            id: result.data.id,
            codice_registrazione: codice_registrazione
          };
        }
      }
    } catch (error) {
      console.error('Errore durante il check duplicati:', error);
      // Continua con la creazione normale se il check fallisce
    }

    // Se non esiste, crea nuova iscrizione
    const response = await fetch(`${strapiUrl}/api/iscrizionis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          ...payload,
          codice_registrazione
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Errore salvataggio: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    return {
      id: result.data.id,
      codice_registrazione: codice_registrazione
    };
  };

  const onSubmit = async (data: WizardData) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Salva iscrizione in Strapi
      const registrationData = await saveRegistrationToStrapi(data);

      setRegistrationId(registrationData.id);

      if (true) { // Cambia in false per disabilitare
      throw new Error('Impossibile procedere al pagamento. Verifica la tua connessione e riprova.');
    }

      // Mostra messaggio di attesa
      setErrorMessage('Reindirizzamento al pagamento in corso...');
      setShowError(true);

      // Procedi con pagamento Stripe
      const includeCena = data.conteggio_pastaparty > 0;
      await createCheckoutSession(
        registrationData.id,
        includeCena,
        data.conteggio_pastaparty,
        registrationData.codice_registrazione,
        data.tipo_gara
      );

      // Se arriviamo qui senza errori, il redirect dovrebbe essere avvenuto
      // Pulisci localStorage dopo successo
      localStorage.removeItem('iscrizione');

    } catch (error: any) {
      console.error('Errore durante l\'iscrizione:', error);

      // Messaggio user-friendly basato sul tipo di errore
      let userMessage = 'Si è verificato un errore durante l\'elaborazione.';

      if (error.message.includes('pagamento')) {
        userMessage = 'Impossibile procedere al pagamento. Verifica la tua connessione e riprova.';
      } else if (error.message.includes('server')) {
        userMessage = 'Il server non risponde. Riprova tra qualche minuto.';
      } else if (error.message) {
        userMessage = error.message;
      }

      // Aggiungi info di debug in development
      if (process.env.NODE_ENV === 'development') {
        userMessage += ` (Debug: ${error.message})`;
      }

      setErrorMessage(userMessage);
      setShowError(true);
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
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isLoading ? 'Elaborazione...' : 'Conferma e Paga'}
              </Button>
              {registrationId && showError && !errorMessage.includes('corso') && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Problemi con il pagamento?
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={async () => {
                      try {
                        setShowError(false);
                        await createCheckoutSession(
                          registrationId,
                          watch('conteggio_pastaparty') > 0,
                          watch('conteggio_pastaparty'),
                          // Trova il codice registrazione salvato
                          'retry_' + registrationId,
                          watch('tipo_gara')
                        );
                      } catch (error) {
                        // Errore già gestito dal hook
                      }
                    }}
                    disabled={stripeLoading}
                  >
                    Riprova Pagamento
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      </FormProvider>

      <Snackbar
        open={showError}
        autoHideDuration={10000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowError(false)}
          severity={errorMessage.includes('corso') ? 'info' : 'error'}
          sx={{ width: '100%', opacity: 1 }}
        >
          {errorMessage}
          {!errorMessage.includes('corso') && registrationId && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" display="block">
                La tua iscrizione è stata salvata (ID: {registrationId}).
                Se il problema persiste, contatta uno dei numeri presenti in fondo alla pagina.
              </Typography>
            </Box>
          )}
        </Alert>
      </Snackbar>

      {/* Alert fisso per problemi comuni */}
      {isSubmitting && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2" gutterBottom>
            <strong>Il pagamento non si apre?</strong>
          </Typography>
          <Typography variant="caption" component="div">
            • Verifica che i popup non siano bloccati<br />
            • Prova con un browser diverso<br />
            • Disabilita temporaneamente AdBlock<br />
            • Se usi Safari, verifica le impostazioni privacy
          </Typography>
        </Alert>
      )}
    </Container>
  );
}