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
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { PDFDocument, StandardFonts } from 'pdf-lib';

/**
 * Liberatoria Step:
 * - Compila PDF AcroForm con nome e cognome
 * - Embed compilato in <iframe> o <object> su desktop
 * - Fallback pulsante su dispositivi touch o viewport <= lg
 * - Checkbox abilitata dopo load (iframe) o click pulsante
 */
export default function Liberatoria() {
  const {
    watch,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const theme = useTheme();
  const isTouch = useMediaQuery('(pointer: coarse)');
  const isBelowLg = useMediaQuery(theme.breakpoints.down('lg'));
  const useButtonFlow = isTouch || isBelowLg;

  // Preleva nome e cognome dallo step1
  const [nome, cognome] = watch(['nome', 'cognome']);

  const [pdfUrl, setPdfUrl] = useState<string>();
  const [canAccept, setCanAccept] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Carica e compila il PDF al mount o al cambio di nome/cognome
  useEffect(() => {
    if (!nome || !cognome) return;
    (async () => {
      // Carica PDF AcroForm dalla cartella public
      const arrayBuffer = await fetch('/liberatoria.pdf').then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Compila i campi AcroForm
      const form = pdfDoc.getForm();
      const nomeField = form.getTextField('Text1');
      const cognomeField = form.getTextField('Text2');
      nomeField.setText(nome);
      cognomeField.setText(cognome);

      // Aggiorna aparenze con font standard
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      nomeField.updateAppearances(helvetica);
      cognomeField.updateAppearances(helvetica);

      // Rendi il form non-editabile flattenando i campi
      nomeField.enableReadOnly();
      cognomeField.enableReadOnly();

      // Genera blob URL
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setValue('liberatoriaPdfBlob', blob, { shouldValidate: false });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    })();
  }, [nome, cognome]);

  // Scroll handler (desktop embedded)
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
      setCanAccept(true);
    }
  };

  // Handler pulsante su touch
  const handleOpen = () => {
    window.open(pdfUrl || '/liberatoria.pdf', '_blank', 'noopener,noreferrer');
    setCanAccept(true);
  };

  return (
    <>
      <Typography sx={visuallyHidden} component="span">
        Procedura di visualizzazione e accettazione liberatoria compilata
      </Typography>

      {useButtonFlow ? (
        <Box textAlign="center" sx={{ my: 4 }}>
          <Button variant="contained" onClick={handleOpen} disabled={!pdfUrl}>
            Visualizza liberatoria
          </Button>
        </Box>
      ) : (
        <Paper
          ref={containerRef}
          onScroll={handleScroll}
          variant="outlined"
          sx={{ height: 600, overflowY: 'auto', p: 2, mt: 4, mb: 3 }}
        >
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
            />
          ) : (
            <Typography>Generazione PDF in corso...</Typography>
          )}
        </Paper>
      )}

      <Controller
        name="liberatoriaAccettata"
        control={control}
        rules={{ required: 'Devi accettare la liberatoria per procedere' }}
        render={({ field }) => (
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value || false}
                  disabled={!canAccept}
                />
              }
              label="Ho letto e accetto la liberatoria"
            />
            {!canAccept && (
              <FormHelperText>
                {useButtonFlow
                  ? 'Apri la liberatoria per poter accettare.'
                  : 'Scorri fino in fondo per abilitare.'}
              </FormHelperText>
            )}
            {field.value && errors.liberatoriaAccettata?.message && (
              <FormHelperText error>
                {errors.liberatoriaAccettata.message.toString()}
              </FormHelperText>
            )}
          </Box>
        )}
      />
    </>
  );
}
