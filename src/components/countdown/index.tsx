"use client";

import { Box, Container, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import theme from '../../theme';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

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

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <Box sx={{
      py: 8,
      background: theme.palette.background.paper
    }}>
      <Container maxWidth="lg" sx={{textAlign: "center"}}>
        <Typography variant='h1' component={"h2"} fontWeight={700} color='text.primary' sx={{
          mb: 5
        }}>Non vediamo l&apos;ora di partire</Typography>
        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          color: theme.palette.text.primary
        }}>
          <Box>
            <Typography variant='h3' component={"p"}>{formatNumber(timeLeft.days)}</Typography>
            <Typography sx={{
              textTransform: "uppercase"
            }}>Giorni</Typography>
          </Box>
          <Box>
            <Typography variant='h3' component={"p"}>{formatNumber(timeLeft.hours)}</Typography>
            <Typography sx={{
              textTransform: "uppercase"
            }}>ore</Typography>
          </Box>
          <Box>
            <Typography variant='h3' component={"p"}>{formatNumber(timeLeft.minutes)}</Typography>
            <Typography sx={{
              textTransform: "uppercase"
            }}>minuti</Typography>
          </Box>
          <Box>
            <Typography variant='h3' component={"p"}>{formatNumber(timeLeft.seconds)}</Typography>
            <Typography sx={{
              textTransform: "uppercase"
            }}>secondi</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
