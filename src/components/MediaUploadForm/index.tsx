'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  Autocomplete,
  TextField,
  Alert,
  LinearProgress,
  IconButton,
  Paper,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { nanoid } from 'nanoid';
import { EVENT } from '@/config/event';
import { getAllMedia } from '@/utils/api';
import { compressImageFile, UnsupportedImageError, CompressedImageResult } from '@/utils/imageCompression';
import { useAdminPassword } from '@/app/gestisci-contenuti/AdminPasswordContext';

const MAX_FILES_PER_CHUNK = 6;
const MAX_CHUNK_BYTES = 3.5 * 1024 * 1024;

type SelectedItem = {
  id: string;
  file: File;
  previewUrl: string;
  status: 'compressing' | 'ready' | 'error';
  compressed?: CompressedImageResult;
  error?: string;
};

type ChunkResult = {
  index: number;
  fileNames: string[];
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  items: SelectedItem[];
};

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function chunkItems(items: SelectedItem[]): SelectedItem[][] {
  const chunks: SelectedItem[][] = [];
  let current: SelectedItem[] = [];
  let currentBytes = 0;

  for (const item of items) {
    const size = item.compressed?.compressedSize ?? item.file.size;
    if (current.length > 0 && (current.length >= MAX_FILES_PER_CHUNK || currentBytes + size > MAX_CHUNK_BYTES)) {
      chunks.push(current);
      current = [];
      currentBytes = 0;
    }
    current.push(item);
    currentBytes += size;
  }
  if (current.length > 0) chunks.push(current);
  return chunks;
}

async function uploadChunk(password: string, edizione: number, items: SelectedItem[]) {
  const formData = new FormData();
  formData.append('password', password);
  formData.append('edizione', String(edizione));
  items.forEach((item) => {
    const blob = item.compressed?.blob ?? item.file;
    const fileName = item.compressed?.fileName ?? item.file.name;
    formData.append('files', blob, fileName);
  });

  const res = await fetch('/api/admin/media', { method: 'POST', body: formData });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Caricamento fallito');
  }
  return data;
}

export default function MediaUploadForm() {
  const password = useAdminPassword();

  const [existingYears, setExistingYears] = useState<number[]>([]);
  const [edizione, setEdizione] = useState<string>(String(EVENT.year));
  const [items, setItems] = useState<SelectedItem[]>([]);
  const [chunkResults, setChunkResults] = useState<ChunkResult[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [phaseText, setPhaseText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAllMedia()
      .then((media) => {
        const years = Array.from(new Set(media.map((m) => m.editionYear))).sort((a, b) => b - a);
        setExistingYears(years);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    return () => {
      items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFilesSelected = (fileList: FileList | null) => {
    if (!fileList) return;
    const newItems: SelectedItem[] = Array.from(fileList).map((file) => ({
      id: nanoid(),
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'compressing',
    }));
    setItems((prev) => [...prev, ...newItems]);
    setChunkResults(null);

    newItems.forEach((item) => {
      compressImageFile(item.file)
        .then((compressed) => {
          setItems((prev) =>
            prev.map((it) => (it.id === item.id ? { ...it, status: 'ready', compressed } : it))
          );
        })
        .catch((err) => {
          const message =
            err instanceof UnsupportedImageError
              ? "Formato non supportato dal browser. Su iPhone: Impostazioni → Fotocamera → Formati → 'Più compatibile', oppure invia la foto tramite WhatsApp/Messaggi prima di caricarla qui."
              : 'Errore durante la preparazione della foto';
          setItems((prev) =>
            prev.map((it) => (it.id === item.id ? { ...it, status: 'error', error: message } : it))
          );
        });
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((it) => it.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((it) => it.id !== id);
    });
  };

  const runUpload = async (toUpload: SelectedItem[]) => {
    const year = Number(edizione);
    const chunks = chunkItems(toUpload);
    const results: ChunkResult[] = chunks.map((chunk, index) => ({
      index,
      fileNames: chunk.map((it) => it.compressed?.fileName ?? it.file.name),
      status: 'pending',
      items: chunk,
    }));
    setChunkResults(results);
    setUploading(true);

    for (let i = 0; i < chunks.length; i++) {
      setPhaseText(`Carico gruppo ${i + 1} di ${chunks.length}…`);
      setChunkResults((prev) =>
        (prev ?? results).map((r) => (r.index === i ? { ...r, status: 'uploading' } : r))
      );
      try {
        await uploadChunk(password, year, chunks[i]);
        setChunkResults((prev) =>
          (prev ?? results).map((r) => (r.index === i ? { ...r, status: 'success' } : r))
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setChunkResults((prev) =>
          (prev ?? results).map((r) => (r.index === i ? { ...r, status: 'error', error: message } : r))
        );
      }
    }

    setUploading(false);
    setPhaseText('');
  };

  const onSubmit = () => {
    const year = Number(edizione);
    if (!Number.isInteger(year) || year < 2000) return;
    const ready = items.filter((it) => it.status === 'ready');
    if (ready.length === 0) return;
    void runUpload(ready);
  };

  const retryChunk = (chunk: ChunkResult) => {
    const year = Number(edizione);
    setUploading(true);
    setPhaseText(`Ricarico gruppo ${chunk.index + 1}…`);
    setChunkResults((prev) =>
      (prev ?? []).map((r) => (r.index === chunk.index ? { ...r, status: 'uploading' } : r))
    );
    uploadChunk(password, year, chunk.items)
      .then(() => {
        setChunkResults((prev) =>
          (prev ?? []).map((r) => (r.index === chunk.index ? { ...r, status: 'success' } : r))
        );
      })
      .catch((err) => {
        setChunkResults((prev) =>
          (prev ?? []).map((r) =>
            r.index === chunk.index ? { ...r, status: 'error', error: String(err?.message || err) } : r
          )
        );
      })
      .finally(() => {
        setUploading(false);
        setPhaseText('');
      });
  };

  const resetAll = () => {
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setItems([]);
    setChunkResults(null);
  };

  const readyCount = items.filter((it) => it.status === 'ready').length;
  const hasErrors = items.some((it) => it.status === 'error');
  const compressingCount = items.filter((it) => it.status === 'compressing').length;

  const allDone = chunkResults !== null && chunkResults.every((r) => r.status === 'success' || r.status === 'error');
  const successCount = chunkResults?.filter((r) => r.status === 'success').reduce((sum, r) => sum + r.fileNames.length, 0) ?? 0;
  const failedChunks = chunkResults?.filter((r) => r.status === 'error') ?? [];

  return (
    <Stack spacing={3}>
      <Autocomplete
        freeSolo
        options={existingYears.map(String)}
        value={edizione}
        onInputChange={(_, value) => setEdizione(value)}
        renderInput={(params) => <TextField {...params} label="Edizione (anno)" size="small" sx={{ maxWidth: 240 }} />}
      />

      <Box>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => onFilesSelected(e.target.files)}
        />
        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          onClick={() => fileInputRef.current?.click()}
        >
          Scegli foto
        </Button>
      </Box>

      {items.length > 0 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 2 }}>
          {items.map((item) => (
            <Paper key={item.id} variant="outlined" sx={{ p: 1, position: 'relative' }}>
              <IconButton
                size="small"
                onClick={() => removeItem(item.id)}
                sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'background.paper' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
              <Box
                component="img"
                src={item.previewUrl}
                alt={item.file.name}
                sx={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 1, mb: 1 }}
              />
              {item.status === 'compressing' && <Chip size="small" label="Comprimo…" />}
              {item.status === 'ready' && item.compressed && (
                <Typography variant="caption" color="text.secondary">
                  {formatSize(item.compressed.originalSize)} → {formatSize(item.compressed.compressedSize)}
                </Typography>
              )}
              {item.status === 'error' && (
                <Typography variant="caption" color="error">
                  {item.error}
                </Typography>
              )}
            </Paper>
          ))}
        </Box>
      )}

      {hasErrors && (
        <Alert severity="warning">
          Alcune foto non verranno caricate perché non supportate: rimuovile o correggile prima di procedere.
        </Alert>
      )}

      {uploading && (
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {phaseText}
          </Typography>
          <LinearProgress />
        </Box>
      )}

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          disabled={readyCount === 0 || compressingCount > 0 || uploading || !edizione}
          onClick={onSubmit}
        >
          Carica {readyCount > 0 ? `(${readyCount})` : ''}
        </Button>
        {items.length > 0 && (
          <Button variant="text" onClick={resetAll} disabled={uploading}>
            Svuota
          </Button>
        )}
      </Stack>

      {allDone && (
        <Stack spacing={1}>
          {successCount > 0 && (
            <Alert severity="success">
              {successCount} foto caricate con successo per l&apos;edizione {edizione}. Controlla su{' '}
              <a href="/galleria" target="_blank" rel="noreferrer">
                /galleria
              </a>
              .
            </Alert>
          )}
          {failedChunks.map((chunk) => (
            <Alert
              key={chunk.index}
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={() => retryChunk(chunk)} disabled={uploading}>
                  Riprova
                </Button>
              }
            >
              Gruppo {chunk.index + 1} non caricato ({chunk.fileNames.join(', ')}): {chunk.error}
            </Alert>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
