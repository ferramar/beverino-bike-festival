// src/components/Liberatoria/index.tsx
import React, { useState, useRef, useEffect, UIEvent } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

/**
 * Liberatoria Step:
 * - Genera PDF con React PDF lato server
 * - Mostra in iframe su desktop o embed su mobile con react-pdf
 * - Checkbox abilitata dopo visualizzazione/scroll
 */
export default function Liberatoria() {
  const {
    watch,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const theme = useTheme();
  const isTouch = useMediaQuery('(pointer: coarse)');
  const isBelowLg = useMediaQuery(theme.breakpoints.down('lg'));
  const useButtonFlow = isTouch || isBelowLg;

  const [pdfUrl, setPdfUrl] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [canAccept, setCanAccept] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Stato per gestione errori
  const [errorDialog, setErrorDialog] = useState(false);
  const [errorDetails, setErrorDetails] = useState<{
    title: string;
    message: string;
    code?: string;
    details?: string;
  } | null>(null);

  // Genera il PDF quando il componente viene montato
  useEffect(() => {
    generatePDF();
  }, []);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      // Ottieni tutti i dati del form
      const formData = getValues();
      
      // Chiama l'API per generare il PDF
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Errore generazione PDF');
      }

      // Converti la risposta in blob
      const pdfBlob = await response.blob();
      
      // Salva il blob nel form per l'invio successivo
      setValue('liberatoriaPdfBlob', pdfBlob, { shouldValidate: false });
      
      // Crea URL per visualizzazione
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setPdfGenerated(true);
      
    } catch (error) {
      console.error('Errore generazione PDF:', error);
      
      let errorTitle = 'Errore Generazione PDF';
      let errorMessage = 'Si è verificato un errore durante la generazione del PDF.';
      let errorCode = 'ERR_GENERIC';
      let errorDetails = '';
      
      if (error instanceof Error) {
        // Log dettagliato per debugging
        console.error('Dettagli errore PDF:', {
          message: error.message,
          stack: error.stack,
          formData: getValues()
        });
        
        // Analizza il tipo di errore per messaggi specifici
        if (error.message.includes('400')) {
          errorTitle = 'Dati Mancanti';
          errorMessage = 'Alcuni dati obbligatori non sono stati compilati correttamente.';
          errorCode = 'ERR_MISSING_DATA';
          errorDetails = 'Verifica di aver compilato tutti i campi obbligatori, specialmente nome e cognome.';
        } else if (error.message.includes('fetch') || error.message.includes('network')) {
          errorTitle = 'Problema di Connessione';
          errorMessage = 'Impossibile connettersi al server per generare il PDF.';
          errorCode = 'ERR_NETWORK';
          errorDetails = 'Verifica la tua connessione internet e riprova. Se il problema persiste, riprova più tardi.';
        } else if (error.message.includes('500')) {
          errorTitle = 'Errore del Server';
          errorMessage = 'Il server ha riscontrato un problema interno.';
          errorCode = 'ERR_SERVER';
          errorDetails = 'Il problema è temporaneo. Riprova tra qualche minuto. Se persiste, contatta il supporto.';
        } else {
          errorDetails = `Dettagli tecnici: ${error.message}`;
        }
      }
      
      // Mostra dialog con errori dettagliati
      setErrorDetails({
        title: errorTitle,
        message: errorMessage,
        code: errorCode,
        details: errorDetails
      });
      setErrorDialog(true);
    } finally {
      setIsGenerating(false);
    }
  };

  // Scroll handler per desktop (abilita checkbox quando scrollato fino in fondo)
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
      setCanAccept(true);
    }
  };

  // Handler per download
  const handleDownload = () => {
    if (!pdfUrl) return;
    
    // Crea link per download
    const link = document.createElement('a');
    link.href = pdfUrl;
    const formData = getValues();
    link.download = `liberatoria_${formData.nome}_${formData.cognome}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler per visualizzazione in nuova finestra
  const handleView = () => {
    if (!pdfUrl) return;
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    setCanAccept(true);
  };

  // Cleanup URL quando il componente viene smontato
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Liberatoria e Consenso
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        La liberatoria è stata generata automaticamente con i tuoi dati. 
        {useButtonFlow 
          ? ' Visualizzala per poter procedere con l\'accettazione.'
          : ' Scorri fino in fondo per poter procedere con l\'accettazione.'}
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
          {/* Pulsante download solo su desktop */}
          {pdfGenerated && !useButtonFlow && (
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                size="small"
                onClick={handleDownload} 
                startIcon={<DownloadIcon />}
              >
                Scarica PDF
              </Button>
            </Box>
          )}

          {useButtonFlow ? (
            // Mobile/Touch: solo pulsante visualizza
            <>
              <Box sx={{ 
                my: 4, 
                display: 'flex', 
                justifyContent: 'center',
                maxWidth: 400,
                mx: 'auto'
              }}>
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
              </Box>
              
              {canAccept && (
                <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
                  Perfetto! Ora puoi procedere con l'accettazione.
                </Alert>
              )}
            </>
          ) : (
            // Desktop: mostra PDF embedded
            <Paper
              ref={containerRef}
              onScroll={handleScroll}
              variant="outlined"
              sx={{ 
                height: 600, 
                overflowY: 'auto', 
                p: 0,
                mt: 2, 
                mb: 3,
                position: 'relative',
                backgroundColor: 'grey.100',
              }}
            >
              {pdfUrl ? (
                <>
                  <iframe
                    src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    title="Liberatoria PDF"
                  />
                  {!hasScrolledToBottom && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(255,255,255,0.9), transparent)',
                        p: 2,
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        ↓ Scorri fino in fondo per abilitare l'accettazione
                      </Typography>
                    </Box>
                  )}
                </>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography>Caricamento PDF...</Typography>
                </Box>
              )}
            </Paper>
          )}

          {/* Alert informativo */}
          {canAccept && (
            <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
              Ottimo! Hai letto tutta la liberatoria. Ora puoi accettare.
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
                      {...field}
                      checked={field.value || false}
                      disabled={!canAccept}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body1">
                      Ho letto e accetto integralmente la liberatoria e il regolamento dell'evento
                    </Typography>
                  }
                />
                {!canAccept && (
                  <FormHelperText>
                    {useButtonFlow
                      ? 'Visualizza la liberatoria per poter accettare'
                      : 'Scorri il documento fino in fondo per poter accettare'}
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
      
      {/* Dialog per errori dettagliati */}
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
            <Box sx={{ 
              backgroundColor: 'grey.100', 
              p: 2, 
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.875rem'
            }}>
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
              generatePDF(); // Riprova
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