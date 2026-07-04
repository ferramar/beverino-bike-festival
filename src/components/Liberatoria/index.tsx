// src/components/Liberatoria/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import {
  formatAccettazioneDigitale,
  getGaraDisplayName,
  getLiberatoriaCopy,
} from '../../config/liberatorie';

/**
 * Liberatoria Step:
 * - Genera PDF lato server con i dati anagrafici e il tipo di gara scelto
 * - Flusso unificato: l'utente deve visualizzare il PDF prima di poter accettare
 */
export default function Liberatoria() {
  const {
    watch,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const tipoGara = watch('tipo_gara') as string;
  const garaLabel = getGaraDisplayName(tipoGara);
  const regulationLabel = getLiberatoriaCopy(tipoGara).regulationLabel;

  const [pdfUrl, setPdfUrl] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [canAccept, setCanAccept] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);

  const [errorDialog, setErrorDialog] = useState(false);
  const [errorDetails, setErrorDetails] = useState<{
    title: string;
    message: string;
    code?: string;
    details?: string;
  } | null>(null);

  const resetAcceptanceState = () => {
    setCanAccept(false);
    setPdfGenerated(false);
    setValue('liberatoriaAccettata', false, { shouldValidate: false });
    setValue('liberatoriaPdfBlob', undefined, { shouldValidate: false });
  };

  const generatePDF = useCallback(
    async (accettazioneDigitale?: string) => {
      setIsGenerating(true);
      if (!accettazioneDigitale) {
        resetAcceptanceState();
      }

      try {
        const formData = getValues();

        const response = await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            accettazioneDigitale,
          }),
        });

        if (!response.ok) {
          throw new Error(`Errore generazione PDF (${response.status})`);
        }

        const pdfBlob = await response.blob();
        setValue('liberatoriaPdfBlob', pdfBlob, { shouldValidate: false });

        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
        setPdfGenerated(true);
        if (accettazioneDigitale) {
          setCanAccept(true);
        }
      } catch (error) {
        console.error('Errore generazione PDF:', error);

        let errorTitle = 'Errore Generazione PDF';
        let errorMessage = 'Si è verificato un errore durante la generazione del PDF.';
        let errorCode = 'ERR_GENERIC';
        let errorDetailsText = '';

        if (error instanceof Error) {
          if (error.message.includes('400')) {
            errorTitle = 'Dati Mancanti';
            errorMessage = 'Alcuni dati obbligatori non sono stati compilati correttamente.';
            errorCode = 'ERR_MISSING_DATA';
            errorDetailsText =
              'Verifica di aver compilato tutti i campi obbligatori nello step precedente.';
          } else if (error.message.includes('fetch') || error.message.includes('network')) {
            errorTitle = 'Problema di Connessione';
            errorMessage = 'Impossibile connettersi al server per generare il PDF.';
            errorCode = 'ERR_NETWORK';
            errorDetailsText =
              'Verifica la tua connessione internet e riprova. Se il problema persiste, riprova più tardi.';
          } else if (error.message.includes('500')) {
            errorTitle = 'Errore del Server';
            errorMessage = 'Il server ha riscontrato un problema interno.';
            errorCode = 'ERR_SERVER';
            errorDetailsText =
              'Il problema è temporaneo. Riprova tra qualche minuto. Se persiste, contatta il supporto.';
          } else {
            errorDetailsText = `Dettagli tecnici: ${error.message}`;
          }
        }

        setErrorDetails({
          title: errorTitle,
          message: errorMessage,
          code: errorCode,
          details: errorDetailsText,
        });
        setErrorDialog(true);
      } finally {
        setIsGenerating(false);
      }
    },
    [getValues, setValue]
  );

  useEffect(() => {
    generatePDF();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoGara]);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const handleDownload = () => {
    if (!pdfUrl) return;
    const formData = getValues();
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `liberatoria_${formData.nome}_${formData.cognome}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = () => {
    if (!pdfUrl) return;
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    setCanAccept(true);
  };

  const handleAcceptanceChange = async (
    checked: boolean,
    onChange: (value: boolean) => void
  ) => {
    if (!checked) {
      onChange(false);
      await generatePDF();
      return;
    }

    const timestamp = formatAccettazioneDigitale();
    onChange(true);
    await generatePDF(timestamp);
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Liberatoria e Consenso
      </Typography>

      <Typography variant="body1" sx={{ mb: 1 }}>
        Liberatoria per: <strong>{garaLabel}</strong>
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Il documento è stato generato automaticamente con i tuoi dati. Visualizzalo per
        intero prima di procedere con l&apos;accettazione.
      </Typography>

      <Typography sx={visuallyHidden} component="span">
        Procedura di visualizzazione e accettazione liberatoria compilata
      </Typography>

      {isGenerating ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Generazione liberatoria in corso...</Typography>
        </Box>
      ) : (
        <>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ my: 3, maxWidth: 520, mx: 'auto' }}
          >
            <Button
              variant="contained"
              onClick={handleView}
              startIcon={<VisibilityIcon />}
              disabled={!pdfGenerated}
              fullWidth
              size="large"
            >
              Visualizza Liberatoria
            </Button>
            <Button
              variant="outlined"
              onClick={handleDownload}
              startIcon={<DownloadIcon />}
              disabled={!pdfGenerated}
              fullWidth
              size="large"
            >
              Scarica PDF
            </Button>
          </Stack>

          {canAccept && (
            <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
              Perfetto! Ora puoi procedere con l&apos;accettazione.
            </Alert>
          )}

          <Controller
            name="liberatoriaAccettata"
            control={control}
            rules={{ required: 'Devi accettare la liberatoria per procedere' }}
            render={({ field }) => (
              <Box sx={{ mt: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value || false}
                      disabled={!canAccept || isGenerating}
                      color="primary"
                      onChange={(event) => {
                        void handleAcceptanceChange(event.target.checked, field.onChange);
                      }}
                    />
                  }
                  label={
                    <Typography variant="body1">
                      Ho letto e accetto integralmente la liberatoria, il regolamento{' '}
                      {regulationLabel}, la dichiarazione di esonero di responsabilità
                      (inclusi gli artt. 1341 e 1342 c.c.), l&apos;informativa privacy e
                      l&apos;autorizzazione all&apos;uso di immagini, come nel documento
                      visualizzato.
                    </Typography>
                  }
                />
                {!canAccept && (
                  <FormHelperText>
                    Visualizza la liberatoria per poter accettare
                  </FormHelperText>
                )}
                {errors.liberatoriaAccettata && (
                  <FormHelperText error>
                    {errors.liberatoriaAccettata.message?.toString()}
                  </FormHelperText>
                )}
              </Box>
            )}
          />
        </>
      )}

      <Dialog
        open={errorDialog}
        onClose={() => setErrorDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ErrorIcon color="error" />
          {errorDetails?.title || 'Errore'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {errorDetails?.message}
          </Typography>

          {errorDetails?.details && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {errorDetails.details}
            </Typography>
          )}

          {errorDetails?.code && (
            <Box
              sx={{
                backgroundColor: 'grey.100',
                p: 2,
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '0.875rem',
              }}
            >
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Codice Errore (da comunicare al supporto):
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {errorDetails.code}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialog(false)} variant="outlined">
            Chiudi
          </Button>
          <Button
            onClick={() => {
              setErrorDialog(false);
              void generatePDF();
            }}
            variant="contained"
            color="primary"
          >
            Riprova
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
