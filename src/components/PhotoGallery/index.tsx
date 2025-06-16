/* eslint-disable */
import React, { useRef, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  Box,
  Skeleton,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Typography
} from '@mui/material';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Masonry from '@mui/lab/Masonry';
import InfiniteScroll from 'react-infinite-scroll-component';

const Lightgallery = dynamic(
  () => import('lightgallery/react').then(mod => mod.default),
  { ssr: false }
);
import lgZoom from 'lightgallery/plugins/zoom';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgFullscreen from 'lightgallery/plugins/fullscreen';
import lgAutoplay from 'lightgallery/plugins/autoplay';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-fullscreen.css';
import 'lightgallery/css/lg-autoplay.css';

export type PhotoItem = { 
  src: string; 
  thumb: string; 
  medium?: string;
  alt?: string;
  year?: number;
};

const ITEMS_PER_PAGE = 12; // Numero di immagini da caricare per volta

export const PhotoGallery: React.FC<{ items: PhotoItem[] }> = ({ items }) => {
  const lg = useRef<any>(null);
  const [displayedItems, setDisplayedItems] = useState<PhotoItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const observerTarget = useRef<HTMLDivElement>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Inizializza con i primi elementi
  useEffect(() => {
    if (items.length > 0) {
      const initialItems = items.slice(0, ITEMS_PER_PAGE);
      setDisplayedItems(initialItems);
      setHasMore(items.length > ITEMS_PER_PAGE);
    }
  }, [items]);

  const onInit: any = (detail: any) => { 
    lg.current = detail.instance; 
  };

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  }, []);

  // Carica più elementi
  const loadMoreItems = useCallback(() => {
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
  }, [page, items]);

  // Intersection Observer per preload delle immagini
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            if (src && !img.src) {
              img.src = src;
            }
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    // Osserva tutte le immagini con data-src
    const images = document.querySelectorAll('img[data-src]');
    images.forEach((img) => observer.observe(img));

    return () => observer.disconnect();
  }, [displayedItems]);

  const columns = isMobile ? 1 : isTablet ? 2 : 3;

  // Loader component
  const loader = (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <CircularProgress />
    </Box>
  );

  // End message
  const endMessage = (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="body1" color="text.secondary">
        Hai visto tutte le foto! 🎉
      </Typography>
    </Box>
  );

  return (
    <>
      <InfiniteScroll
        dataLength={displayedItems.length}
        next={loadMoreItems}
        hasMore={hasMore}
        loader={loader}
        endMessage={endMessage}
        scrollThreshold={0.8}
        style={{ overflow: 'visible' }}
      >
        <Masonry 
          columns={columns} 
          spacing={2}
          sx={{
            width: '100%',
          }}
        >
          <AnimatePresence>
            {displayedItems.map((item, idx) => (
              <motion.div
                key={`photo-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  duration: 0.4,
                  delay: (idx % ITEMS_PER_PAGE) * 0.05 
                }}
                layout
              >
                <PhotoCard
                  item={item}
                  index={idx}
                  onClick={() => lg.current?.openGallery(idx)}
                  onLoad={() => handleImageLoad(idx)}
                  isLoaded={loadedImages.has(idx)}
                  priority={idx < 6}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </Masonry>
      </InfiniteScroll>

      <Lightgallery
        onInit={onInit}
        dynamic
        download={true}
        plugins={[lgZoom, lgThumbnail, lgFullscreen, lgAutoplay]}
        dynamicEl={displayedItems.map(i => ({ 
          src: i.src, 
          thumb: i.thumb,
          subHtml: i.alt || 'Beverino Bike Festival'
        }))}
        speed={500}
        backdropDuration={300}
        hideBarsDelay={2000}
        mousewheel={true}
        mobileSettings={{
          controls: true,
          showCloseIcon: true,
          download: false,
        }}
      />
    </>
  );
};

// Componente separato per ottimizzare il re-rendering
const PhotoCard = React.memo(({ 
  item, 
  index, 
  onClick, 
  onLoad, 
  isLoaded,
  priority 
}: {
  item: PhotoItem;
  index: number;
  onClick: () => void;
  onLoad: () => void;
  isLoaded: boolean;
  priority: boolean;
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Box
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      aria-label={`Apri foto ${index + 1}${item.year ? ` dell'edizione ${item.year}` : ''}`}
      sx={{
        cursor: 'pointer',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'grey.100',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
          '& .overlay': {
            opacity: 1,
          },
          '& img': {
            transform: 'scale(1.05)',
          }
        }
      }}
    >
      <Box 
        position="relative" 
        width="100%"
        sx={{
          minHeight: 200,
          overflow: 'hidden'
        }}
      >
        {!isLoaded && !imageError && (
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height={250} 
            animation="wave"
            sx={{ position: 'absolute', top: 0, left: 0 }}
          />
        )}
        
        {imageError ? (
          <Box
            sx={{
              width: '100%',
              height: 250,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.200',
              color: 'grey.500'
            }}
          >
            <Typography variant="body2">
              Immagine non disponibile
            </Typography>
          </Box>
        ) : (
          <Image 
            src={item.medium || item.src}
            alt={item.alt || `Foto ${index + 1}`} 
            width={500}
            height={500}
            style={{ 
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              opacity: isLoaded ? 1 : 0,
              display: 'block'
            }}
            sizes={`(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw`}
            onLoad={onLoad}
            onError={() => setImageError(true)}
            priority={priority}
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        )}
        
        {/* Overlay con icona */}
        <Box
          className="overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Box>
        </Box>

        {/* Anno badge */}
        {item.year && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.875rem',
              fontWeight: 600,
              backdropFilter: 'blur(4px)'
            }}
          >
            {item.year}
          </Box>
        )}
      </Box>
    </Box>
  );
});