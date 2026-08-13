'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetcher, getAllSponsorCategories } from '@/utils/api';
import SponsorAdminForm, { AdminCategoria, AdminSponsor } from '@/components/SponsorAdminForm';
import { useAdminPassword } from '../AdminPasswordContext';

function resolveLogoUrl(url?: string): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const base = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  return `${base}${url}`;
}

type RawSponsor = {
  documentId: string;
  nome: string;
  descrizione?: string;
  sito?: string;
  principale?: boolean;
  logo?: { url?: string };
  categorie_sponsors?: Array<{ id: number }>;
};

async function fetchSponsorsAdmin(): Promise<AdminSponsor[]> {
  const { data } = await fetcher('/api/sponsors?populate=*&sort=principale:desc,nome:asc&pagination[pageSize]=80');
  if (!data || !Array.isArray(data)) return [];
  return (data as RawSponsor[]).map((item) => ({
    documentId: item.documentId,
    nome: item.nome,
    descrizione: item.descrizione || '',
    sito: item.sito || '',
    principale: !!item.principale,
    logoUrl: resolveLogoUrl(item.logo?.url),
    categorieIds: (item.categorie_sponsors || []).map((c) => c.id),
  }));
}

export default function GestisciSponsorPage() {
  const password = useAdminPassword();
  const [sponsors, setSponsors] = useState<AdminSponsor[]>([]);
  const [categories, setCategories] = useState<AdminCategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminSponsor | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [sponsorList, categoryList] = await Promise.all([fetchSponsorsAdmin(), getAllSponsorCategories()]);
      setSponsors(sponsorList);
      setCategories(categoryList);
    } catch {
      setError('Errore nel caricamento degli sponsor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const openCreate = () => {
    setEditing(undefined);
    setDialogOpen(true);
  };

  const openEdit = (sponsor: AdminSponsor) => {
    setEditing(sponsor);
    setDialogOpen(true);
  };

  const onSaved = () => {
    setDialogOpen(false);
    void loadAll();
  };

  const onDelete = async (sponsor: AdminSponsor) => {
    if (!window.confirm(`Eliminare definitivamente "${sponsor.nome}"?`)) return;
    setDeletingId(sponsor.documentId);
    setError('');
    try {
      const res = await fetch(`/api/admin/sponsors/${sponsor.documentId}`, {
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
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Button component={Link} href="/gestisci-contenuti" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Indietro
      </Button>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="h4" fontWeight={700}>
          Sponsor
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Aggiungi sponsor
        </Button>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Visualizza, modifica o elimina gli sponsor mostrati sul sito.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : sponsors.length === 0 ? (
        <Alert severity="info">Nessuno sponsor presente.</Alert>
      ) : (
        <Stack spacing={2}>
          {sponsors.map((sponsor) => (
            <Paper key={sponsor.documentId} variant="outlined" sx={{ p: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                {sponsor.logoUrl ? (
                  <Box
                    component="img"
                    src={sponsor.logoUrl}
                    alt={sponsor.nome}
                    sx={{ width: 80, height: 60, objectFit: 'contain', flexShrink: 0 }}
                  />
                ) : (
                  <Box sx={{ width: 80, height: 60, flexShrink: 0 }} />
                )}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="subtitle1" fontWeight={600}>
                      {sponsor.nome}
                    </Typography>
                    {sponsor.principale && <Chip label="Principale" size="small" color="primary" />}
                  </Stack>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 0.5 }}>
                    {sponsor.categorieIds.map((id) => (
                      <Chip key={id} label={categories.find((c) => c.id === id)?.nome ?? id} size="small" variant="outlined" />
                    ))}
                  </Stack>
                </Box>
                <IconButton onClick={() => openEdit(sponsor)} aria-label="Modifica">
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => onDelete(sponsor)}
                  aria-label="Elimina"
                  disabled={deletingId === sponsor.documentId}
                  color="error"
                >
                  {deletingId === sponsor.documentId ? <CircularProgress size={20} /> : <DeleteIcon />}
                </IconButton>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Modifica sponsor' : 'Nuovo sponsor'}</DialogTitle>
        <DialogContent>
          <SponsorAdminForm
            initial={editing}
            categories={categories}
            onSaved={onSaved}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
}
