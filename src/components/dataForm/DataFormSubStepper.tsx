'use client';

import { Box, LinearProgress, Step, StepLabel, Stepper, Typography } from '@mui/material';

export const DATA_SUB_STEP_LABELS = ['Anagrafica', 'Residenza', 'Documento'] as const;

interface DataFormSubStepperProps {
  activeSubStep: number;
}

export default function DataFormSubStepper({ activeSubStep }: DataFormSubStepperProps) {
  const progress = ((activeSubStep + 1) / DATA_SUB_STEP_LABELS.length) * 100;

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Dati personali — passo {activeSubStep + 1} di {DATA_SUB_STEP_LABELS.length}
        </Typography>
        <Typography variant="body2" color="primary" fontWeight={600}>
          {DATA_SUB_STEP_LABELS[activeSubStep]}
        </Typography>
      </Box>
      <LinearProgress variant="determinate" value={progress} sx={{ mb: 2, borderRadius: 1 }} />
      <Stepper activeStep={activeSubStep} alternativeLabel sx={{ display: { xs: 'none', sm: 'flex' } }}>
        {DATA_SUB_STEP_LABELS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
