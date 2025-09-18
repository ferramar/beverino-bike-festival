'use client';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Stack, Alert, FormControlLabel, Checkbox } from '@mui/material';
import * as XLSX from 'xlsx';

type Item = {
  id: number;
  nome?: string;
  cognome?: string;
  email?: string;
  tipo_gara?: string;
  pasta_party?: boolean;
  conteggio_pastaparty?: number;
  taglia_maglietta?: string;
  stato_pagamento?: string;
  codice_registrazione?: string;
  createdAt?: string;
  // campi per minorenni
  dati_genitore?: any;
  nomeTutore?: string | null;
  cognomeTutore?: string | null;
};

function toCsv(rows: Item[]): string {
  const headers = [
    'id', 'nome', 'cognome', 'email', 'tipo_gara', 'pasta_party', 'conteggio_pastaparty', 'taglia_maglietta', 'stato_pagamento', 'codice_registrazione', 'createdAt'
  ];
  const lines = [headers.join(',')];
  for (const r of rows) {
    const values = [
      r.id,
      (r.nome || ''),
      (r.cognome || ''),
      (r.email || ''),
      (r.tipo_gara || ''),
      r.pasta_party ? 'true' : 'false',
      (r.conteggio_pastaparty ?? ''),
      (r.taglia_maglietta || ''),
      (r.stato_pagamento || ''),
      (r.codice_registrazione || ''),
      (r.createdAt || '')
    ];
    lines.push(values.map(v => String(v).replaceAll('"', '""')).map(v => /[,\n]/.test(v) ? `"${v}"` : v).join(','));
  }
  return lines.join('\n');
}

export default function IscrittiPage() {
  const [password, setPassword] = useState<string>('');
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [info, setInfo] = useState<string>('');
  const [onlyPastaParty, setOnlyPastaParty] = useState<boolean>(false);
  const [onlyMinors, setOnlyMinors] = useState<boolean>(false);
  const [authorized, setAuthorized] = useState<boolean>(false);

  useEffect(() => {
  // Auto-login da sessionStorage, se presente
  try {
    const saved = sessionStorage.getItem('iscritti_password');
    if (saved && !authorized) {
      setPassword(saved);
      void fetchList(saved);
    }
  } catch {}
  }, []);

  const fetchList = async (pass: string) => {
    setLoading(true);
    setError('');
    setInfo('');
    try {
      const res = await fetch('/api/iscritti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass }),
      });
      const text = await res.text();
      let data: any = null;
      try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
      if (!res.ok) {
        const message = data?.error || 'Errore';
        setError(`${message} (status ${res.status})`);
        setItems([]);
        setAuthorized(false);
      } else {
        let rows: Item[] = data.data || [];
        // Applica filtri client-side
        if (onlyPastaParty) {
          rows = rows.filter(r => !!r.pasta_party || (r.conteggio_pastaparty ?? 0) > 0);
        }
        if (onlyMinors) {
          rows = rows.filter(r => !!r.dati_genitore || !!r.nomeTutore);
        }
        setItems(rows);
        setInfo(`Caricati ${rows.length} record`);
        setAuthorized(true);
        try { sessionStorage.setItem('iscritti_password', pass); } catch {}
      }
    } catch (e: any) {
      setError(String(e?.message || e));
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const onExportExcel = () => {
    // Prepara i dati per Excel
    const excelData = items.map(r => ({
      'ID': r.id,
      'Nome': r.nome || '',
      'Cognome': r.cognome || '',
      'Email': r.email || '',
      'Tipo Gara': r.tipo_gara || '',
      'Pasta Party': r.pasta_party ? 'Sì' : 'No',
      'Conteggio Pasta Party': r.conteggio_pastaparty || 0,
      'Taglia Maglietta': r.taglia_maglietta || '',
      'Stato Pagamento': r.stato_pagamento || '',
      'Codice Registrazione': r.codice_registrazione || '',
      'Minorenne': (r.dati_genitore || r.nomeTutore) ? 'Sì' : 'No',
      'Nome Genitore/Tutore': r.dati_genitore?.nome || r.nomeTutore || '',
      'Cognome Genitore/Tutore': r.dati_genitore?.cognome || r.cognomeTutore || ''
    }));

    // Crea il workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Imposta larghezza colonne
    const colWidths = [
      { wch: 8 },   // ID
      { wch: 15 },  // Nome
      { wch: 15 },  // Cognome
      { wch: 25 },  // Email
      { wch: 15 },  // Tipo Gara
      { wch: 12 },  // Pasta Party
      { wch: 18 },  // Conteggio Pasta Party
      { wch: 15 },  // Taglia Maglietta
      { wch: 15 },  // Stato Pagamento
      { wch: 20 },  // Codice Registrazione
      { wch: 12 },  // Minorenne
      { wch: 20 },  // Nome Genitore/Tutore
      { wch: 20 }   // Cognome Genitore/Tutore
    ];
    ws['!cols'] = colWidths;
    
    // Aggiungi il foglio al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Iscritti');
    
    // Esporta
    XLSX.writeFile(wb, 'iscritti_pagati.xlsx');
  };

  if (!authorized) {
    return (
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Box component={Paper} sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column' }} spacing={2}>
            <TextField label="Password" value={password} onChange={(e) => setPassword(e.target.value)} size="small" type="password" />
            <Button variant="contained" onClick={() => fetchList(password)} disabled={!password || loading}>{loading ? 'Verifico…' : 'Entra'}</Button>
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Elenco iscritti (pagamento completato)
      </Typography>
      <Box component={Paper} sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
          <Button variant="contained" onClick={() => fetchList(password)} disabled={loading}>{loading ? 'Carico…' : 'Ricarica'}</Button>
          <Button variant="outlined" onClick={onExportExcel} disabled={items.length === 0}>Esporta Excel</Button>
          {info && <Typography variant="body2" color="text.secondary">{info}</Typography>}
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ mt: 2 }}>
          <FormControlLabel control={<Checkbox checked={onlyPastaParty} onChange={(e) => setOnlyPastaParty(e.target.checked)} />} label="Solo con Pasta Party" />
          <FormControlLabel control={<Checkbox checked={onlyMinors} onChange={(e) => setOnlyMinors(e.target.checked)} />} label="Solo minorenni (con genitore/tutore)" />
          <Button size="small" onClick={() => fetchList(password)} disabled={!password || loading}>Applica filtri</Button>
        </Stack>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {info && <Alert severity="info" sx={{ mb: 2 }}>{info}</Alert>}
      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Cognome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Tipo raduno</TableCell>
              <TableCell>Pasta party</TableCell>
              <TableCell>Maglietta</TableCell>
              <TableCell>Codice</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.nome}</TableCell>
                <TableCell>{r.cognome}</TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell>{r.tipo_gara}</TableCell>
                <TableCell>{r.pasta_party ? 'Sì' : 'No'}{r.conteggio_pastaparty ? ` (${r.conteggio_pastaparty})` : ''}</TableCell>
                <TableCell>{r.taglia_maglietta || '-'}</TableCell>
                <TableCell>{r.codice_registrazione}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}


