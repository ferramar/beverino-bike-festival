"use client"
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import {
  Box,
  Container,
  Typography,
  Grid,
  Skeleton,
  Fade,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import { getAllMedia } from '../../utils/api';
import { PhotoGallery, PhotoItem } from '../../components/PhotoGallery';
import { VideoCard, VideoItem } from '../../components/VideoCard';
import { VideoDialog } from '../../components/VideoDialog';
import InfiniteScroll from 'react-infinite-scroll-component';
import GalleryFilters from '../../components/GalleryFilters';

export default function GalleryPage() {
  const [mode, setMode] = useState<'photos' | 'videos'>('photos');
  const [year, setYear] = useState<'all' | number>('all');
  const [selected, setSelected] = useState<VideoItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, error } = useSWR('/api/media-edizionis', getAllMedia);
  const items = data || [];

  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
  }, [data]);

  const filtered = items.filter(i => year === 'all' || i.editionYear === year);

  const photoItems: PhotoItem[] = filtered
    .filter(i => i.type === 'image')
    .map(i => ({
      src: i.url,
      thumb: i.thumbnailUrl || i.url,
      alt: i.title || 'Beverino Bike Festival',
      year: i.editionYear
    }));

  const videoItems: VideoItem[] = filtered
    .filter(i => i.type === 'video')
    .map(i => ({
      url: i.url,
      title: i.title || 'Video Beverino Bike Festival',
      year: i.editionYear
    }));

  const years = Array.from(new Set(items.map(i => i.editionYear))).sort((a, b) => b - a);

  const photoCount = photoItems.length;
  const videoCount = videoItems.length;

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box
          sx={{
            textAlign: 'center',
            p: 6,
            backgroundColor: 'error.lighter',
            borderRadius: 2
          }}
        >
          <Typography variant="h5" color="error">
            Errore nel caricamento della galleria
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Riprova più tardi o contatta l'assistenza
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{
      py: { xs: 8, md: 10 },
      backgroundColor: '#fafafa',
      minHeight: '100vh'
    }}>
      <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2, md: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center', px: { xs: 2, sm: 0 } }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(135deg, #A52D0C 0%, #FB6616 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 2
            }}
          >
            Galleria Multimediale
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto' }}
          >
            Rivivi le emozioni delle passate edizioni attraverso foto e video
          </Typography>
        </Box>

        {/* Filters Section - con padding su mobile */}
        <Box sx={{ px: { xs: 2, sm: 0 } }}>
          <GalleryFilters
            mode={mode}
            year={year}
            years={years}
            photoCount={photoItems.length}
            videoCount={videoItems.length}
            filteredCount={mode === 'photos' ? photoItems.length : videoItems.length}
            onModeChange={setMode}
            onYearChange={setYear}
          />
        </Box>

        {/* Content Section */}
        <Box sx={{ px: { xs: 0, sm: 2, md: 0 } }}>
          <Fade in={!isLoading} timeout={800}>
            <Box sx={{
              paddingInline: {xs: "1rem", sm: 0}
            }}>
              {isLoading ? (
                <Grid container spacing={{ xs: 0, sm: 2 }} sx={{ px: { xs: 0, sm: 0 } }}>
                  {[...Array(8)].map((_, i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
                      <Skeleton
                        variant="rectangular"
                        height={250}
                        sx={{
                          borderRadius: { xs: 0, sm: 2 },
                          mb: { xs: 0.5, sm: 0 }
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <>
                  {mode === 'photos' ? (
                    photoItems.length > 0 ? (
                      <PhotoGallery items={photoItems} />
                    ) : (
                      <EmptyState type="foto" year={year} />
                    )
                  ) : (
                    videoItems.length > 0 ? (
                      <VideoGalleryWithInfiniteScroll
                        items={videoItems}
                        onVideoClick={setSelected}
                      />
                    ) : (
                      <EmptyState type="video" year={year} />
                    )
                  )}
                </>
              )}
            </Box>
          </Fade>
        </Box>

        <VideoDialog
          open={!!selected}
          video={selected}
          onClose={() => setSelected(null)}
        />
      </Container>
    </Box>
  );
}

// Componente per stato vuoto
const EmptyState: React.FC<{ type: string; year: 'all' | number }> = ({ type, year }) => (
  <Box
    sx={{
      textAlign: 'center',
      py: 10,
      px: 3,
      backgroundColor: 'grey.50',
      borderRadius: 3,
      border: '2px dashed',
      borderColor: 'grey.300'
    }}
  >
    <Typography variant="h5" color="text.secondary" gutterBottom>
      Nessun {type} disponibile
      {year !== 'all' && ` per l'edizione ${year}`}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Prova a selezionare un anno diverso o torna più tardi
    </Typography>
  </Box>
);

// Componente per video con infinite scroll
const VideoGalleryWithInfiniteScroll: React.FC<{
  items: VideoItem[];
  onVideoClick: (video: VideoItem) => void;
}> = ({ items, onVideoClick }) => {
  const [displayedItems, setDisplayedItems] = useState<VideoItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 9;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (items.length > 0) {
      const initialItems = items.slice(0, ITEMS_PER_PAGE);
      setDisplayedItems(initialItems);
      setHasMore(items.length > ITEMS_PER_PAGE);
    }
  }, [items]);

  const loadMoreItems = () => {
    const nextPage = page + 1;
    const startIndex = nextPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newItems = items.slice(startIndex, endIndex);

    if (newItems.length > 0) {
      setDisplayedItems(prev => [...prev, ...newItems]);
      setPage(nextPage);
      setHasMore(endIndex < items.length);
    } else {
      setHasMore(false);
    }
  };

  return (
    <InfiniteScroll
      dataLength={displayedItems.length}
      next={loadMoreItems}
      hasMore={hasMore}
      loader={
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      }
      endMessage={
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Hai visto tutti i video! 🎬
          </Typography>
        </Box>
      }
      scrollThreshold={0.8}
    >
      <Grid container spacing={{ xs: 0.5, sm: 3 }}>
        {displayedItems.map((v, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`video-${idx}`}>
            <Box sx={{ px: { xs: 0, sm: 0 } }}>
              <VideoCard
                url={v.url}
                title={v.title}
                onClick={() => onVideoClick(v)}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </InfiniteScroll>
  );
};