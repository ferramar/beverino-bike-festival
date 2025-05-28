"use client"
// src/components/IscrizioneWizard.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Button,
  Container,
  Typography,
  useMediaQuery,
} from '@mui/material';
import DataForm from '../dataForm';
import Liberatoria from '../Liberatoria';
import FinalRegistrationStep from '../FinalRegistrationStep';
import { customAlphabet } from 'nanoid';
import strapi from '../../utils/strapi';

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
  const router = useRouter();
  const [userAgent, setUserAgent] = useState('');

  // Persistenza su localStorage
  // useEffect(() => {
  //   const sub = watch((v) => localStorage.setItem('iscrizione', JSON.stringify(v)));
  //   return () => sub.unsubscribe();
  // }, [watch]);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setUserAgent(navigator.userAgent);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Carica valori salvati
    const stored = localStorage.getItem('iscrizione');
    if (stored) {
      try {
        reset(JSON.parse(stored));
      } catch {
        console.warn('Dati in localStorage non validi');
      }
    }
    // Salva ogni cambiamento
    const subscription = watch((value) => {
      localStorage.setItem('iscrizione', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Campi per la validazione step-by-step
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
    if (await trigger(toValidate)) setActiveStep(s => s + 1);
  };

  const onBack = () => setActiveStep(s => s - 1);

  const onSubmit = async (data: WizardData) => {
    const codice_registrazione = nanoid();
    if (!data.liberatoriaPdfBlob) {
      alert('Errore: PDF non generato');
      return;
    }
    const ipRes = await fetch('https://api.ipify.org?format=json');
    const { ip: userIp } = await ipRes.json();

    const formData = new FormData();
    const fileName = "liberatoria_" + data.nome + "_" + data.cognome + ".pdf"
    formData.append('files', data.liberatoriaPdfBlob, fileName);
    const uploadRes = await strapi.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const pdfId = uploadRes.data[0].id;

    const log_firma_liberatoria = {
      orario_firmatario: new Date().toISOString(),
      ip_firmatario: userIp,
      user_agent_firmatario: userAgent
    }

    const payload = {
      ...data,
      codice_registrazione,
      log_firma_liberatoria,
      pasta_party: data.conteggio_pastaparty > 0 ? true : false,
      liberatoriaPdf: pdfId
    }

    delete payload.liberatoriaPdfBlob

    try {
      await strapi.post('/api/iscrizionis', {
        data: payload
      });
      router.push('/iscrizione-successo')
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
        Iscriviti al Beverino Bike Festival
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Compila il form e procedi con le istruzioni per confermare la tua partecipazione.
      </Typography>

      {!isMobile &&
        <Stepper sx={{ mt: 6 }} activeStep={activeStep} connector={<StepConnector />}>
          {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
        </Stepper>
      }

      <FormProvider {...methods}>
        <Box sx={{ mb: 4 }}>
          {activeStep === 0 && <DataForm />}
          {activeStep === 1 && <Liberatoria />}
          {activeStep === 2 && <FinalRegistrationStep />}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
          <Button disabled={activeStep === 0} onClick={onBack} variant="outlined">
            Indietro
          </Button>
          {isMobile && <Typography>{activeStep + 1}/{steps.length}</Typography>}
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={onNext}>
              Avanti
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
              Conferma e Paga
            </Button>
          )}
        </Box>
      </FormProvider>
    </Container>
  );
}