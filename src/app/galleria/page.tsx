// GalleryPage.tsx – Static demo with separate Material-UI, Next.js Image and lightgallery.js galleries
"use client"

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
  Box,
  Grid,
  Card,
  CardActionArea,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  Container,
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ImageIcon from '@mui/icons-material/Image';

// Dynamically import LightGallery to keep bundle size down
const Lightgallery = dynamic(() => import('lightgallery/react'), { ssr: false });
import lgZoom from 'lightgallery/plugins/zoom';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgVideo from 'lightgallery/plugins/video';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-video.css';

// Media item type
type MediaItem = {
  id: number;
  url: string;
  type: 'image' | 'video';
  editionYear: number;
  thumbnailUrl?: string;
};

// Mock data for demo – replace with real data once Strapi is integrated
const mediaItems: MediaItem[] = [
  { id: 1, url: 'https://picsum.photos/seed/picsum/800/600', type: 'image', editionYear: 2023 },
  { id: 2, url: 'https://picsum.photos/seed/picsum/900/600', type: 'image', editionYear: 2022 },
  { id: 3, url: 'https://www.youtube.com/watch?v=C3vyugaBhSs', type: 'video', editionYear: 2023, thumbnailUrl: 'https://picsum.photos/seed/picsum/800/600' },
  { id: 4, url: 'https://www.youtube.com/watch?v=a0XBHsSOEos', type: 'video', editionYear: 2024, thumbnailUrl: 'https://picsum.photos/seed/picsum/800/600' },
];

const GalleryPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'images' | 'videos'>('images');
  const [filterYear, setFilterYear] = useState<'all' | number>('all');
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const lg = useRef<any>(null);

  // Handle toggle between image and video galleries
  const handleViewChange = (_: React.MouseEvent<HTMLElement>, mode: 'images' | 'videos') => {
    if (mode) setViewMode(mode);
  };

  const handleYearChange = (event: SelectChangeEvent<'all' | number>) => {
    setFilterYear(event.target.value as 'all' | number);
  };

  // Unique years
  const years = Array.from(new Set(mediaItems.map(item => item.editionYear))).sort((a, b) => b - a);

  // Filter items by year and type
  const itemsToShow = mediaItems.filter(item =>
    (filterYear === 'all' || item.editionYear === filterYear) &&
    (viewMode === 'images' ? item.type === 'image' : item.type === 'video')
  );
  
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const onInit = (detail: any) => { lg.current = detail.instance; };

  // Build dynamic elements for LightGallery
  const dynamicEl = itemsToShow.map(item => {
    if (item.type === 'image') {
      return { src: item.url, thumb: item.url };
    } else {
      // Video: use video plugin
      return {
        src: item.url,
        thumb: item.thumbnailUrl || item.url,
      };
    }
  });

  return (
    <Box component="main" sx={{ pt: '8rem', pb: 4 }}>
      <Container maxWidth="lg">
        {/* View toggle and year filter */}
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <ToggleButtonGroup value={viewMode} exclusive onChange={handleViewChange}>
            <ToggleButton value="images">Foto</ToggleButton>
            <ToggleButton value="videos">Video</ToggleButton>
          </ToggleButtonGroup>
          <FormControl variant="outlined" size="small">
            <InputLabel id="year-label">Anno</InputLabel>
            <Select<'all' | number>
              labelId="year-label"
              value={filterYear}
              onChange={handleYearChange}
              label="Anno"
            >
              <MenuItem value="all">Tutti</MenuItem>
              {years.map(year => <MenuItem key={year} value={year}>{year}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        {/* Media grid */}
        <Grid container spacing={2}>
          {itemsToShow.map((item, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
              <Card>
                <CardActionArea onClick={() => lg.current.openGallery(idx)}>
                  <Box position="relative" width="100%" height={200}>
                    <Image
                      src={item.type === 'image' ? item.url : (item.thumbnailUrl || item.url)}
                      alt={`Media ${item.id}`}
                      layout="fill"
                      objectFit="cover"
                    />
                    {/* Overlay icon */}
                    <Box position="absolute" top={8} right={8} bgcolor="rgba(0,0,0,0.6)" borderRadius="50%" p={0.5}>
                      {item.type === 'video' ? <PlayCircleOutlineIcon htmlColor="#fff" /> : <ImageIcon htmlColor="#fff" />}
                    </Box>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* LightGallery for current view */}
        <Lightgallery
          onInit={onInit}
          dynamic
          slideDelay={400}
          download={false}
          plugins={viewMode === 'images' ? [lgZoom, lgThumbnail] : [lgVideo, lgThumbnail]}
          dynamicEl={dynamicEl}
        />
      </Container>
    </Box>
  );
};

export default GalleryPage;
