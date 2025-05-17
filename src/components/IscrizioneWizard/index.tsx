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


// Definizione tipi dati del wizard
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
  partecipoSoloGara: boolean;
  cenaInclusa: boolean;
}

const steps = ['Dati Personali', 'Liberatoria', 'Opzioni'];

export default function IscrizioneWizard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const methods = useForm<WizardData>({
    mode: 'onTouched',
    defaultValues: {},
  });
  const { watch, trigger, handleSubmit, reset } = methods;
  const [activeStep, setActiveStep] = useState(0);
  const router = useRouter();

  // Persistenza su localStorage
  // useEffect(() => {
  //   const sub = watch((v) => localStorage.setItem('iscrizione', JSON.stringify(v)));
  //   return () => sub.unsubscribe();
  // }, [watch]);

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
    2: ['partecipoSoloGara', 'cenaInclusa'],
  };

  const onNext = async () => {
    const toValidate = fieldsPerStep[activeStep];
    if (await trigger(toValidate)) setActiveStep(s => s + 1);
  };

  const onBack = () => setActiveStep(s => s - 1);

  const onSubmit = (data: WizardData) => {
    console.log('Invio finale:', data);
    // TODO: POST su Strapi
    setTimeout(() => {
      localStorage.removeItem('iscrizione');
      router.push('/iscrizione-successo')
    }, 100);
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
          {activeStep === 2 && <p>step di riepilogo e pagamento</p>}
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