// components/VideoDialog.tsx
import React from 'react';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { VideoItem } from '../VideoCard';

export const VideoDialog: React.FC<{
  open: boolean;
  video: VideoItem | null;
  onClose: () => void;
}> = ({ open, video, onClose }) => (
  <Dialog
    fullScreen
    open={open}
    onClose={onClose}                // permette anche ESC/backdrop
    PaperProps={{ sx: { backgroundColor: '#000' } }}
  >
    <AppBar
      position="relative"
      sx={{ backgroundColor: 'rgba(0,0,0,0.8)', color: '#fff' }}
      elevation={0}
    >
      <Toolbar>
        <IconButton
          edge="start"
          onClick={onClose}           // il click chiude davvero
          sx={{ color: '#fff' }}      // icona bianca sempre visibile
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        <Typography
          sx={{ ml: 2, flex: 1 }}
          variant="h6"
        >
          Video
        </Typography>
      </Toolbar>
    </AppBar>

    {video && (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <video
          src={video.url}
          controls
          autoPlay
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      </Box>
    )}
  </Dialog>
);
