import React from 'react';
import {
  Card,
  CardActionArea,
  Box
} from '@mui/material';
import Image from 'next/image';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useVideoThumbnail } from '../../hooks/useVideoThumbnail';

export type VideoItem = { url: string };

export const VideoCard: React.FC<VideoItem & { onClick: () => void }> = ({ url, onClick }) => {
  const thumb = useVideoThumbnail(url, 1);
  return (
    <Card>
      <CardActionArea onClick={onClick}>
        <Box position="relative" width="100%" height={200}>
          {thumb ? (
            <Image src={thumb} alt="video thumb" fill style={{ objectFit: 'cover' }} />
          ) : (
            <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
              Loading…
            </Box>
          )}
          <Box position="absolute" top={8} right={8} bgcolor="rgba(0,0,0,0.6)" p={0.5} borderRadius="50%">
            <PlayCircleOutlineIcon htmlColor="#fff" />
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
};