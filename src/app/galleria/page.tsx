"use client"
import React, { useState } from 'react';
import useSWR from 'swr';
import {
  Box,
  Container,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { getAllMedia } from '../../utils/api';
import { PhotoGallery, PhotoItem } from '../../components/PhotoGallery';
import { VideoCard, VideoItem } from '../../components/VideoCard';
import { VideoDialog } from '../../components/VideoDialog';
import Head from 'next/head';

export default function GalleryPage() {
  const [mode, setMode] = useState<'photos' | 'videos'>('photos');
  const [year, setYear] = useState<'all' | number>('all');
  const [selected, setSelected] = useState<VideoItem | null>(null);

  const { data, error } = useSWR('/api/media-edizionis', getAllMedia);
  const items = data || [];

  const filtered = items.filter(i => year === 'all' || i.editionYear === year);

  const photoItems: PhotoItem[] = filtered
    .filter(i => i.type === 'image')
    .map(i => ({ src: i.url, thumb: i.thumbnailUrl || i.url }));

  const videoItems: VideoItem[] = filtered
    .filter(i => i.type === 'video')
    .map(i => ({ url: i.url }));

  const years = Array.from(new Set(items.map(i => i.editionYear))).sort((a, b) => b - a);

  if (error) return <Box p={2}>Errore caricamento</Box>;
  if (!data) return <Box p={2}>Loading...</Box>;

  return (
    <Box component="main" sx={{ pt: '8rem', pb: 4 }}>
      <Head>
        <title>Galleria | Beverin Bike Festival</title>
        <meta name="description" content="Galleria fotografica Beverino Bike Festival" />
      </Head>
      <Container maxWidth="lg">
        <Box sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <ToggleButtonGroup value={mode} exclusive onChange={(_, v) => v && setMode(v)}>
            <ToggleButton value="photos">Foto</ToggleButton>
            <ToggleButton value="videos">Video</ToggleButton>
          </ToggleButtonGroup>
          <FormControl size="small" sx={{ ml: 2 }}>
            <InputLabel id="year-label">Anno</InputLabel>
            <Select labelId="year-label" value={year} onChange={e => setYear(e.target.value)} label="Anno">
              <MenuItem value="all">Tutti</MenuItem>
              {years.map((y: number) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        {mode === 'photos' ? (
          <PhotoGallery items={photoItems} />
        ) : (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {videoItems.map((v, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={idx}>
                <VideoCard url={v.url} onClick={() => setSelected(v)} />
              </Grid>
            ))}
          </Grid>
        )}

        <VideoDialog open={!!selected} video={selected} onClose={() => setSelected(null)} />
      </Container>
    </Box>
  );
}