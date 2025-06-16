import React, { useState } from 'react';
import {
  Card,
  CardActionArea,
  Box,
  Typography,
  Skeleton,
  Chip
} from '@mui/material';
import Image from 'next/image';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useVideoThumbnail } from '../../hooks/useVideoThumbnail';
import { motion } from 'framer-motion';

export type VideoItem = { 
  url: string; 
  title?: string;
  duration?: string;
  year?: number;
};

export const VideoCard: React.FC<VideoItem & { onClick: () => void }> = ({ 
  url, 
  title, 
  duration,
  year,
  onClick 
}) => {
  const thumb = useVideoThumbnail(url, 1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
    >
      <Card
        elevation={0}
        sx={{
          borderRadius: { xs: 0, sm: 2 },
          overflow: 'hidden',
          backgroundColor: 'grey.100',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid',
          borderColor: 'grey.200',
          borderWidth: { xs: '0 0 1px 0', sm: '1px' },
          '&:hover': {
            boxShadow: { xs: 'none', sm: '0 10px 30px rgba(0,0,0,0.15)' },
            borderColor: { xs: 'grey.200', sm: 'primary.light' },
            '& .play-overlay': {
              backgroundColor: 'rgba(0,0,0,0.7)',
            },
            '& .play-icon': {
              transform: 'scale(1.1)',
            }
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardActionArea onClick={onClick}>
          <Box position="relative" width="100%" sx={{ aspectRatio: '16/9' }}>
            {/* Skeleton while loading */}
            {(!thumb || !imageLoaded) && (
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height="100%" 
                animation="wave"
                sx={{ position: 'absolute', top: 0, left: 0 }}
              />
            )}
            
            {/* Thumbnail */}
            {thumb && (
              <Image 
                src={thumb} 
                alt={title || "Video thumbnail"} 
                fill 
                style={{ 
                  objectFit: 'cover',
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease'
                }}
                onLoad={() => setImageLoaded(true)}
              />
            )}
            
            {/* Dark overlay */}
            <Box
              className="play-overlay"
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              sx={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)',
                backgroundColor: 'rgba(0,0,0,0.4)',
                transition: 'background-color 0.3s ease',
              }}
            />
            
            {/* Play button */}
            <Box
              position="absolute"
              top="50%"
              left="50%"
              sx={{
                transform: 'translate(-50%, -50%)',
              }}
            >
              <PlayCircleIcon 
                className="play-icon"
                sx={{ 
                  fontSize: 70,
                  color: 'white',
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
                  transition: 'transform 0.3s ease',
                }}
              />
            </Box>

            {/* Top badges */}
            <Box
              position="absolute"
              top={12}
              left={12}
              right={12}
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              {year && (
                <Chip
                  label={year}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    fontWeight: 600,
                    backdropFilter: 'blur(4px)',
                  }}
                />
              )}
              {duration && (
                <Chip
                  icon={<AccessTimeIcon sx={{ fontSize: 16, color: 'white' }} />}
                  label={duration}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    fontWeight: 500,
                    backdropFilter: 'blur(4px)',
                    ml: 'auto'
                  }}
                />
              )}
            </Box>

            {/* Title overlay */}
            {title && (
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                p={2}
                sx={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: 'white',
                    fontWeight: 600,
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {title}
                </Typography>
              </Box>
            )}
          </Box>
        </CardActionArea>
      </Card>
    </motion.div>
  );
};