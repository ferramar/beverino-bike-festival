'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Container,
  Typography,
  Button,
  Stack,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
  Box,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetcher } from '@/utils/api';
import { blocksToPlainText } from '@/lib/faqBlocks';
import type { StrapiBlock } from '@/types/faq';
import { useAdminPassword } from '../AdminPasswordContext';

type AdminFaq = { documentId: string; domanda: string; risposta: string; attivo: boolean };
type RawFaq = { documentId: string; domanda: string; risposta: StrapiBlock[]; attivo: boolean };

async function fetchFaqsAdmin(): Promise<AdminFaq[]> {
  const { data } = await fetcher('/api/faqs?sort=ordine:asc');
  if (!data || !Array.isArray(data)) return [];
  return (data as RawFaq[]).map((item) => ({
    documentId: item.documentId,
    domanda: item.domanda,
    risposta: blocksToPlainText(item.risposta),
    attivo: item.attivo,
  }));
}

export default function GestisciFaqPage() {
  const password = useAdminPassword();
  const [faqs, setFaqs] = useState<AdminFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminFaq | undefined>(undefined);
  const [domanda, setDomanda] = useState('');
  const [risposta, setRisposta] = useState('');
  const [attivo, setAttivo] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setFaqs(await fetchFaqsAdmin());
    } catch {
      setError('Errore nel caricamento delle FAQ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const openCreate = () => {
    setEditing(undefined);
    setDomanda('');
    setRisposta('');
    setAttivo(true);
    setFormError('');
    setDialogOpen(true);
  };

  const openEdit = (faq: AdminFaq) => {
    setEditing(faq);
    setDomanda(faq.domanda);
    setRisposta(faq.risposta);
    setAttivo(faq.attivo);
    setFormError('');
    setDialogOpen(true);
  };

  const onSubmit = async () => {
    if (!domanda.trim() || !risposta.trim()) {
      setFormError('Domanda e risposta sono obbligatorie');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const url = editing ? `/api/admin/faq/${editing.documentId}` : '/api/admin/faq';
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, domanda: domanda.trim(), risposta: risposta.trim(), attivo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Salvataggio fallito');
      setDialogOpen(false);
      void loadAll();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Errore durante il salvataggio');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (faq: AdminFaq) => {
    if (!window.confirm(`Eliminare la FAQ "${faq.domanda}"?`)) return;
    setDeletingId(faq.documentId);
    setError('');
    try {
      const res = await fetch(`/api/admin/faq/${faq.documentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Eliminazione fallita');
      void loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante l’eliminazione');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Button component={Link} href="/gestisci-contenuti" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Indietro
      </Button>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="h4" fontWeight={700}>
          FAQ
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Aggiungi
        </Button>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Domande e risposte mostrate nella pagina FAQ del sito. La risposta è testo semplice
        (senza grassetto o elenchi): un paragrafo per riga, separati da una riga vuota.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : faqs.length === 0 ? (
        <Alert severity="info">Nessuna FAQ presente.</Alert>
      ) : (
        <Stack spacing={1}>
          {faqs.map((faq) => (
            <Paper key={faq.documentId} variant="outlined" sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                  <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {faq.domanda}
                  </Typography>
                  {!faq.attivo && <Chip label="Non attiva" size="small" />}
                </Stack>
                <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                  <IconButton onClick={() => openEdit(faq)} aria-label="Modifica">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => onDelete(faq)}
                    aria-label="Elimina"
                    disabled={deletingId === faq.documentId}
                    color="error"
                  >
                    {deletingId === faq.documentId ? <CircularProgress size={18} /> : <DeleteIcon fontSize="small" />}
                  </IconButton>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Modifica FAQ' : 'Nuova FAQ'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Domanda" value={domanda} onChange={(e) => setDomanda(e.target.value)} fullWidth />
            <TextField
              label="Risposta"
              value={risposta}
              onChange={(e) => setRisposta(e.target.value)}
              multiline
              minRows={4}
              fullWidth
            />
            <FormControlLabel
              control={<Switch checked={attivo} onChange={(e) => setAttivo(e.target.checked)} />}
              label="Attiva (visibile sul sito)"
            />
            {formError && <Alert severity="error">{formError}</Alert>}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={() => setDialogOpen(false)} disabled={saving}>
                Annulla
              </Button>
              <Button variant="contained" onClick={onSubmit} disabled={saving}>
                {saving ? <CircularProgress size={20} /> : editing ? 'Salva modifiche' : 'Aggiungi'}
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
