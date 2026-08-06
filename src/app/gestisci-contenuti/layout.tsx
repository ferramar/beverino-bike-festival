'use client';
import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import AdminPasswordGate from '@/components/AdminPasswordGate';
import { AdminPasswordProvider } from './AdminPasswordContext';

const STORAGE_KEY = 'iscritti_password';

export default function GestisciContenutiLayout({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setChecking(false);
      return;
    }
    fetch('/api/admin/verify-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: saved }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setPassword(saved);
        } else {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  const handleAuthorized = (pass: string) => {
    sessionStorage.setItem(STORAGE_KEY, pass);
    setPassword(pass);
  };

  if (checking) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!password) {
    return <AdminPasswordGate onAuthorized={handleAuthorized} />;
  }

  return <AdminPasswordProvider value={password}>{children}</AdminPasswordProvider>;
}
