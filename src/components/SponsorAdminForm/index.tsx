'use client';
import { useRef, useState } from 'react';
import {
  Stack,
  TextField,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
  Box,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { compressImageFile } from '@/utils/imageCompression';
import { useAdminPassword } from '@/app/gestisci-contenuti/AdminPasswordContext';

export type AdminCategoria = { id: number; nome: string };

export type AdminSponsor = {
  documentId: string;
  nome: string;
  descrizione: string;
  sito: string;
  principale: boolean;
  logoUrl: string | null;
  categorieIds: number[];
};

interface SponsorAdminFormProps {
  initial?: AdminSponsor;
  categories: AdminCategoria[];
  onSaved: () => void;
  onCancel: () => void;
}

export default function SponsorAdminForm({ initial, categories, onSaved, onCancel }: SponsorAdminFormProps) {
  const password = useAdminPassword();
  const isEdit = !!initial;

  const [nome, setNome] = useState(initial?.nome ?? '');
  const [descrizione, setDescrizione] = useState(initial?.descrizione ?? '');
  const [sito, setSito] = useState(initial?.sito ?? '');
  const [principale, setPrincipale] = useState(initial?.principale ?? false);
  const [categorieIds, setCategorieIds] = useState<number[]>(initial?.categorieIds ?? []);
  const [logoPreview, setLogoPreview] = useState<string | null>(initial?.logoUrl ?? null);
  const [logoBlob, setLogoBlob] = useState<Blob | null>(null);
  const [logoFileName, setLogoFileName] = useState<string>('logo.jpg');
  const [compressing, setCompressing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onLogoSelected = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setCompressing(true);
    try {
      const compressed = await compressImageFile(file);
      setLogoBlob(compressed.blob);
      setLogoFileName(compressed.fileName);
      setLogoPreview(URL.createObjectURL(compressed.blob));
    } catch {
      setError('Formato immagine non supportato dal browser');
    } finally {
      setCompressing(false);
    }
  };

  const onSubmit = async () => {
    if (!nome.trim()) {
      setError('Il nome è obbligatorio');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('password', password);
      formData.append('nome', nome.trim());
      formData.append('descrizione', descrizione);
      formData.append('sito', sito);
      formData.append('principale', String(principale));
      formData.append('categorie', JSON.stringify(categorieIds));
      if (logoBlob) {
        formData.append('logo', logoBlob, logoFileName);
      }

      const url = isEdit ? `/api/admin/sponsors/${initial!.documentId}` : '/api/admin/sponsors';
      const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Salvataggio fallito');
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante il salvataggio');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={2} sx={{ pt: 1 }}>
      <TextField label="Nome sponsor" value={nome} onChange={(e) => setNome(e.target.value)} required fullWidth />
      <TextField
        label="Descrizione"
        value={descrizione}
        onChange={(e) => setDescrizione(e.target.value)}
        multiline
        minRows={2}
        fullWidth
      />
      <TextField label="Sito web" value={sito} onChange={(e) => setSito(e.target.value)} fullWidth />

      <FormControl fullWidth>
        <InputLabel id="categorie-label">Categorie</InputLabel>
        <Select
          labelId="categorie-label"
          multiple
          value={categorieIds}
          onChange={(e) => setCategorieIds(typeof e.target.value === 'string' ? [] : (e.target.value as number[]))}
          input={<OutlinedInput label="Categorie" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((id) => (
                <Chip key={id} label={categories.find((c) => c.id === id)?.nome ?? id} size="small" />
              ))}
            </Box>
          )}
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.nome}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControlLabel
        control={<Switch checked={principale} onChange={(e) => setPrincipale(e.target.checked)} />}
        label="Sponsor principale"
      />

      <Box>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => onLogoSelected(e.target.files)}
        />
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={() => fileInputRef.current?.click()}
            disabled={compressing}
          >
            {compressing ? 'Comprimo…' : logoPreview ? 'Cambia logo' : 'Carica logo'}
          </Button>
          {logoPreview && (
            <Box
              component="img"
              src={logoPreview}
              alt="Anteprima logo"
              sx={{ height: 60, maxWidth: 140, objectFit: 'contain', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 0.5 }}
            />
          )}
        </Stack>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button onClick={onCancel} disabled={saving}>
          Annulla
        </Button>
        <Button variant="contained" onClick={onSubmit} disabled={saving || compressing}>
          {saving ? <CircularProgress size={20} /> : isEdit ? 'Salva modifiche' : 'Aggiungi sponsor'}
        </Button>
      </Stack>
    </Stack>
  );
}
