import { Box, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

interface CustomStepperProps {
  activeStep: number;
  steps: string[];
}

export function OrangeStepper({ activeStep, steps }: CustomStepperProps) {
  return (
    <Box sx={{ my: 6, px: 2 }}> {/* Più spazio sopra e sotto */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {steps.map((label, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          const isLast = index === steps.length - 1;

          return (
            <Box key={label} sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Step Circle */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  mx: 2, // Più spazio orizzontale
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: isCompleted
                      ? '#4CAF50' // Verde per completati
                      : isActive
                        ? '#BF360C' // Arancione del tuo sito
                        : '#E0E0E0', // Grigio per non raggiunti
                    color: isCompleted || isActive ? 'white' : '#9E9E9E',
                    transition: 'all 0.3s ease',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: isActive
                      ? '0 6px 20px #BF360C' // Ombra arancione
                      : isCompleted
                        ? '0 4px 12px rgba(76, 175, 80, 0.2)' // Ombra verde
                        : 'none',
                    border: isActive ? '3px solid #BF360C' : 'none', // Bordo arancione chiaro
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle sx={{ fontSize: 32 }} />
                  ) : (
                    <Typography variant="h5" fontWeight={700}>
                      {index + 1}
                    </Typography>
                  )}
                </Box>

                {/* Step Label */}
                <Typography
                  variant="body1"
                  sx={{
                    mt: 2, // Più spazio dal cerchio
                    fontWeight: isActive ? 700 : isCompleted ? 600 : 400,
                    color: isActive
                      ? '#BF360C'
                      : isCompleted
                        ? '#4CAF50'
                        : '#666',
                    textAlign: 'center',
                    minWidth: 100,
                    fontSize: '0.95rem',
                  }}
                >
                  {label}
                </Typography>
              </Box>

              {/* Connector Line */}
              {!isLast && (
                <Box
                  sx={{
                    width: { xs: 60, md: 100 }, // Responsive
                    height: 4,
                    bgcolor: index < activeStep ? '#4CAF50' : '#E0E0E0',
                    mx: 1,
                    mt: -4, // Allinea con i cerchi
                    borderRadius: 2,
                    transition: 'background-color 0.5s ease',
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}