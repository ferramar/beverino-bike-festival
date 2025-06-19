"use client";

import { Box, Container, Typography, Paper } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { keyframes } from '@mui/system';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export function Countdown() {
  const targetDate = "2025-09-21T00:00:00";

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const eventTime = new Date(targetDate).getTime();
    const diff = Math.max(eventTime - now, 0);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const timeUnits = [
    { value: timeLeft.days, label: 'Giorni', color: '#FF6B6B' },
    { value: timeLeft.hours, label: 'Ore', color: '#4ECDC4' },
    { value: timeLeft.minutes, label: 'Minuti', color: '#45B7D1' },
    { value: timeLeft.seconds, label: 'Secondi', color: '#96CEB4' },
  ];

  if (!mounted) {
    return (
      <Box sx={{ py: 10, background: 'background.paper' }}>
        <Container maxWidth="lg" sx={{ textAlign: "center" }}>
          <Typography variant='h3'>Caricamento...</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{
      py: 10,
      backgroundColor: "#fff",
      background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
      position: 'relative',
      overflow: 'hidden',
      '&:before': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '150%',
        height: '150%',
        background: 'radial-gradient(circle, rgba(255,107,107,0.05) 0%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
      }
    }}>
      <Container maxWidth="lg" sx={{ textAlign: "center", position: 'relative', zIndex: 1 }}>
        <Typography
          variant='h2'
          component="h2"
          fontWeight={700}
          color='text.primary'
          sx={{
            mb: 2,
            animation: `${fadeIn} 0.8s ease-out`,
            fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' }
          }}
        >
          Non vediamo l&apos;ora di partire
        </Typography>

        <Typography
          variant="h6"
          component={"p"}
          color="text.secondary"
          sx={{
            mb: 6,
            animation: `${fadeIn} 0.8s ease-out 0.2s both`,
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          Il countdown è iniziato! Preparati per l&apos;evento ciclistico più emozionante dell&apos;anno.
        </Typography>

        <Box
          component={"dl"}
          aria-label="Tempo rimanente all'evento"
          aria-live="polite"
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            gap: { xs: 2, md: 3 },
            maxWidth: 800,
            mx: 'auto',
          }}>
          {timeUnits.map((unit, index) => (
            <Paper
              key={unit.label}
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                backgroundColor: 'white',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'grey.200',
                animation: `${fadeIn} 0.8s ease-out ${0.3 + index * 0.1}s both`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: `0 10px 30px rgba(0,0,0,0.1)`,
                  borderColor: unit.color,
                },
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: unit.color,
                }
              }}
            >
              <Typography
                variant='h2'
                component="dt"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 800,
                  color: 'text.primary',
                  lineHeight: 1,
                  mb: 1,
                  animation: unit.label === 'Secondi' ? `${pulse} 1s ease-in-out infinite` : 'none',
                }}
              >
                {formatNumber(unit.value)}
              </Typography>
              <Typography
                component={"dd"}
                sx={{
                  textTransform: "uppercase",
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                  fontWeight: 600,
                  color: 'text.secondary',
                  letterSpacing: 1,
                }}
              >
                {unit.label}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
}