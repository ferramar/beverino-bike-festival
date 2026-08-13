'use client';
import { useState } from 'react';
import { Container, Box, Paper, Stack, TextField, Button, Alert } from '@mui/material';

interface AdminPasswordGateProps {
  onAuthorized: (password: string) => void;
}

export default function AdminPasswordGate({ onAuthorized }: AdminPasswordGateProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!password) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || 'Password errata');
        return;
      }
      onAuthorized(password);
    } catch {
      setError('Errore di connessione, riprova');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Box component={Paper} sx={{ p: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            size="small"
            type="password"
          />
          <Button variant="contained" onClick={submit} disabled={!password || loading}>
            {loading ? 'Verifico…' : 'Entra'}
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </Box>
    </Container>
  );
}
