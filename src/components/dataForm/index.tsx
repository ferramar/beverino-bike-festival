/* eslint-disable */
'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import AnagraficaStep from './AnagraficaStep';
import ResidenzaStep from './ResidenzaStep';
import DocumentoStep from './DocumentoStep';
import DataFormSubStepper from './DataFormSubStepper';

interface DataFormProps {
  activeSubStep: number;
}

export default function DataForm({ activeSubStep }: DataFormProps) {
  return (
    <Box component="form" noValidate sx={{ mt: 2, mb: 2 }}>
      <Typography sx={visuallyHidden}>Inserisci i dati personali</Typography>

      <DataFormSubStepper activeSubStep={activeSubStep} />

      {activeSubStep === 0 && <AnagraficaStep />}
      {activeSubStep === 1 && <ResidenzaStep />}
      {activeSubStep === 2 && <DocumentoStep />}
    </Box>
  );
}
