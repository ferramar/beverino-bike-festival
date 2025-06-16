// components/GalleryFilters.tsx
import React from 'react';
import {
  Box,
  Chip,
  Stack,
  Typography,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  alpha,
  Fade
} from '@mui/material';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { motion } from 'framer-motion';

interface GalleryFiltersProps {
  mode: 'photos' | 'videos';
  year: 'all' | number;
  years: number[];
  photoCount: number;
  videoCount: number;
  filteredCount: number;
  onModeChange: (mode: 'photos' | 'videos') => void;
  onYearChange: (year: 'all' | number) => void;
}

export default function GalleryFilters({
  mode,
  year,
  years,
  photoCount,
  videoCount,
  filteredCount,
  onModeChange,
  onYearChange
}: GalleryFiltersProps) {
  const theme = useTheme();
  const [yearMenuAnchor, setYearMenuAnchor] = React.useState<null | HTMLElement>(null);
  
  const handleYearMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setYearMenuAnchor(event.currentTarget);
  };
  
  const handleYearMenuClose = () => {
    setYearMenuAnchor(null);
  };

  const handleYearSelect = (selectedYear: 'all' | number) => {
    onYearChange(selectedYear);
    handleYearMenuClose();
  };

  return (
    <>
      {/* Filtri */}
      <Box
        sx={{
          mb: 3,
          p: 3,
          background: 'background.paper',
          borderRadius: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          position: 'sticky',
          top: 70,
          zIndex: 100,
          backdropFilter: 'blur(10px)',
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'stretch', md: 'center' }}>
          {/* Selettore Tipo Media */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Tipo di contenuto
            </Typography>
            <Stack direction="row" spacing={1}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Chip
                  icon={<PhotoLibraryIcon />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Foto
                      <Box
                        component="span"
                        aria-label={`${photoCount} foto disponibili`}
                        sx={{
                          backgroundColor: mode === 'photos' ? theme.palette.primary.main : theme.palette.action.disabled,
                          color: 'white',
                          px: 1,
                          py: 0.25,
                          borderRadius: 10,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          minWidth: 24,
                          textAlign: 'center'
                        }}
                      >
                        {photoCount}
                      </Box>
                    </Box>
                  }
                  onClick={() => onModeChange('photos')}
                  color={mode === 'photos' ? 'primary' : 'default'}
                  variant={mode === 'photos' ? 'filled' : 'outlined'}
                  sx={{
                    px: 2,
                    py: 3,
                    fontSize: '0.95rem',
                    fontWeight: mode === 'photos' ? 600 : 400,
                    border: mode === 'photos' ? 'none' : '2px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: mode === 'photos' ? 'primary.dark' : alpha(theme.palette.primary.main, 0.08),
                    }
                  }}
                />
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Chip
                  icon={<VideoLibraryIcon />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Video
                      <Box
                        component="span"
                        aria-label={`${videoCount} video disponibili`}
                        sx={{
                          backgroundColor: mode === 'videos' ? theme.palette.primary.main : theme.palette.action.disabled,
                          color: 'white',
                          px: 1,
                          py: 0.25,
                          borderRadius: 10,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          minWidth: 24,
                          textAlign: 'center'
                        }}
                      >
                        {videoCount}
                      </Box>
                    </Box>
                  }
                  onClick={() => onModeChange('videos')}
                  color={mode === 'videos' ? 'primary' : 'default'}
                  variant={mode === 'videos' ? 'filled' : 'outlined'}
                  sx={{
                    px: 2,
                    py: 3,
                    fontSize: '0.95rem',
                    fontWeight: mode === 'videos' ? 600 : 400,
                    border: mode === 'videos' ? 'none' : '2px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: mode === 'videos' ? 'primary.dark' : alpha(theme.palette.primary.main, 0.08),
                    }
                  }}
                />
              </motion.div>
            </Stack>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

          {/* Filtro Anno */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Filtra per anno
            </Typography>
            <Chip
              icon={<CalendarMonthIcon />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {year === 'all' ? 'Tutte le edizioni' : `Edizione ${year}`}
                  <KeyboardArrowDownIcon fontSize="small" />
                </Box>
              }
              onClick={handleYearMenuOpen}
              variant="outlined"
              sx={{
                px: 2,
                py: 3,
                fontSize: '0.95rem',
                border: '2px solid',
                borderColor: year !== 'all' ? 'primary.main' : 'divider',
                backgroundColor: year !== 'all' ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                }
              }}
            />
          </Box>
        </Stack>

        {/* Menu Anno con animazione semplice */}
        <Menu
          anchorEl={yearMenuAnchor}
          open={Boolean(yearMenuAnchor)}
          onClose={handleYearMenuClose}
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              maxHeight: 400,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              borderRadius: 2,
            }
          }}
        >
          <MenuItem
            onClick={() => handleYearSelect('all')}
            selected={year === 'all'}
            sx={{
              py: 1.5,
              px: 2,
              fontSize: '0.95rem',
              fontWeight: year === 'all' ? 600 : 400,
            }}
          >
            Tutte le edizioni
          </MenuItem>
          
          <Divider sx={{ my: 0.5 }} />
          
          {years.map((y) => (
            <MenuItem
              key={y}
              onClick={() => handleYearSelect(y)}
              selected={year === y}
              sx={{
                py: 1.5,
                px: 2,
                fontSize: '0.95rem',
                fontWeight: year === y ? 600 : 400,
              }}
            >
              Edizione {y}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Conteggio risultati */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          {filteredCount > 0 ? (
            <>
              <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>
                {filteredCount}
              </Box>
              {' '}
              {mode === 'photos' ? (filteredCount === 1 ? 'foto trovata' : 'foto trovate') : (filteredCount === 1 ? 'video trovato' : 'video trovati')}
              {year !== 'all' && (
                <> per l'edizione {year}</>
              )}
            </>
          ) : (
            `Nessun ${mode === 'photos' ? 'a foto' : ' video'} trovato${year !== 'all' ? ` per l'edizione ${year}` : ''}`
          )}
        </Typography>
      </Box>
    </>
  );
}