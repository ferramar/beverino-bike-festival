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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetcher } from '@/utils/api';
import { useAdminPassword } from '../AdminPasswordContext';

type AdminCategoria = { documentId: string; nome: string };
type RawCategoria = { documentId: string; nome: string };

async function fetchCategoriesAdmin(): Promise<AdminCategoria[]> {
  const { data } = await fetcher('/api/categorie-sponsors?sort=nome:asc');
  if (!data || !Array.isArray(data)) return [];
  return (data as RawCategoria[]).map((item) => ({ documentId: item.documentId, nome: item.nome }));
}

export default function GestisciCategorieSponsorPage() {
  const password = useAdminPassword();
  const [categorie, setCategorie] = useState<AdminCategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategoria | undefined>(undefined);
  const [nomeInput, setNomeInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setCategorie(await fetchCategoriesAdmin());
    } catch {
      setError('Errore nel caricamento delle categorie');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const openCreate = () => {
    setEditing(undefined);
    setNomeInput('');
    setFormError('');
    setDialogOpen(true);
  };

  const openEdit = (categoria: AdminCategoria) => {
    setEditing(categoria);
    setNomeInput(categoria.nome);
    setFormError('');
    setDialogOpen(true);
  };

  const onSubmit = async () => {
    if (!nomeInput.trim()) {
      setFormError('Il nome è obbligatorio');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const url = editing ? `/api/admin/categorie-sponsor/${editing.documentId}` : '/api/admin/categorie-sponsor';
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, nome: nomeInput.trim() }),
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

  const onDelete = async (categoria: AdminCategoria) => {
    if (!window.confirm(`Eliminare la categoria "${categoria.nome}"? Gli sponsor collegati non verranno eliminati, perderanno solo questa categoria.`)) return;
    setDeletingId(categoria.documentId);
    setError('');
    try {
      const res = await fetch(`/api/admin/categorie-sponsor/${categoria.documentId}`, {
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
          Categorie sponsor
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Aggiungi
        </Button>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Le categorie usate per raggruppare gli sponsor sul sito.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : categorie.length === 0 ? (
        <Alert severity="info">Nessuna categoria presente.</Alert>
      ) : (
        <Stack spacing={1}>
          {categorie.map((categoria) => (
            <Paper key={categoria.documentId} variant="outlined" sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography>{categoria.nome}</Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton onClick={() => openEdit(categoria)} aria-label="Modifica">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => onDelete(categoria)}
                    aria-label="Elimina"
                    disabled={deletingId === categoria.documentId}
                    color="error"
                  >
                    {deletingId === categoria.documentId ? <CircularProgress size={18} /> : <DeleteIcon fontSize="small" />}
                  </IconButton>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{editing ? 'Modifica categoria' : 'Nuova categoria'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Nome categoria"
              value={nomeInput}
              onChange={(e) => setNomeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
              autoFocus
              fullWidth
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
