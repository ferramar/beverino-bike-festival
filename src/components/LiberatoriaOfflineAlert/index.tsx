// src/components/LiberatoriaOfflineAlert/index.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Alert,
  AlertTitle,
  Paper,
  Chip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Print as PrintIcon,
  PersonOutline as PersonIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

export default function LiberatoriaOfflineAlert() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDownload = () => {
    // Scarica la liberatoria vuota
    const link = document.createElement('a');
    link.href = '/liberatoria.pdf';
    link.download = 'liberatoria_beverino_bike_festival.pdf';
    link.click();
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      {/* Banner Opzione 1: Card moderna con gradiente */}
      <Paper 
        elevation={0}
        sx={{ 
          mb: 3,
          p: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 1,
            }}>
              <PersonIcon sx={{ color: 'primary.main' }} />
            </Box>
            
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Iscrizione in presenza
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preferisci compilare la liberatoria a mano? Scaricala e portala il giorno della gara
              </Typography>
            </Box>
          </Box>
          
          <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            onClick={handleOpenDialog}
            sx={{ 
              borderRadius: 8,
              textTransform: 'none',
              px: 3,
            }}
          >
            Scopri come
          </Button>
        </Box>
      </Paper>

      {/* Banner Opzione 2: Minimalista con accent */}
      {/* <Box 
        sx={{ 
          mb: 3,
          p: 2,
          borderLeft: '4px solid',
          borderColor: 'primary.main',
          backgroundColor: 'grey.50',
          borderRadius: 1,
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}>
          <Typography variant="body1">
            💡 <strong>Alternativa:</strong> Puoi anche iscriverti di persona il giorno della gara
          </Typography>
          
          <Button
            size="small"
            onClick={handleOpenDialog}
            sx={{ 
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Info →
          </Button>
        </Box>
      </Box> */}

      {/* Banner Opzione 3: Chip style */}
      {/* <Box 
        sx={{ 
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Chip 
          icon={<InfoIcon />}
          label="Iscrizione alternativa disponibile"
          color="primary"
          variant="outlined"
        />
        <Typography variant="body2" color="text.secondary">
          Puoi anche compilare la liberatoria a mano e portarla il giorno della gara
        </Typography>
        <Button
          size="small"
          variant="text"
          onClick={handleOpenDialog}
          sx={{ ml: 'auto' }}
        >
          Dettagli
        </Button>
      </Box> */}

      {/* Dialog con istruzioni dettagliate */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 1.5,
          pt: 2,
          px: { xs: 2, sm: 3 }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PrintIcon color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />
            <Typography 
              variant="h6" 
              component="span" 
              fontWeight={600}
              sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
            >
              Iscrizione il giorno della gara
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="chiudi"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2, px: { xs: 2, sm: 3 } }}>
          <Typography 
            variant="body2" 
            component={'p'} 
            sx={{ mb: 2, fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Se preferisci iscriverti di persona il giorno della gara, segui questi passaggi:
          </Typography>
          
          <List dense sx={{ py: 0 }}>
            <ListItem sx={{ pl: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="1. Scarica la liberatoria"
                secondary="Clicca sul pulsante qui sotto per scaricare il modulo PDF"
                primaryTypographyProps={{ 
                  variant: 'body2',
                  fontWeight: 600,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
                secondaryTypographyProps={{ 
                  variant: 'caption',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              />
            </ListItem>
            
            <ListItem sx={{ pl: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="2. Compila e firma"
                secondary="Compila tutti i campi richiesti e firma il documento"
                primaryTypographyProps={{ 
                  variant: 'body2',
                  fontWeight: 600,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
                secondaryTypographyProps={{ 
                  variant: 'caption',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              />
            </ListItem>
            
            <ListItem sx={{ pl: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="3. Porta il modulo il 21 settembre"
                secondary="Presentati alla segreteria dalle ore 8:00 con il modulo compilato"
                primaryTypographyProps={{ 
                  variant: 'body2',
                  fontWeight: 600,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
                secondaryTypographyProps={{ 
                  variant: 'caption',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              />
            </ListItem>
            
            <ListItem sx={{ pl: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="4. Completa l'iscrizione"
                secondary="Paga la quota di partecipazione (€25 gara + €12 pasta party opzionale)"
                primaryTypographyProps={{ 
                  variant: 'body2',
                  fontWeight: 600,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
                secondaryTypographyProps={{ 
                  variant: 'caption',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              />
            </ListItem>
          </List>
          
          <Alert 
            severity="warning" 
            sx={{ 
              mt: 2,
              '& .MuiAlert-message': { py: 0 },
              '& .MuiAlertTitle-root': { mb: 0.5 }
            }}
          >
            <AlertTitle sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              Importante
            </AlertTitle>
            <Typography variant="caption" component="div" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              • L'iscrizione il giorno della gara è soggetta a disponibilità posti<br />
              • Ti consigliamo di arrivare presto per assicurarti il pettorale<br />
              • Porta un documento d'identità valido<br />
              • Per i minori è necessaria la presenza di un genitore
            </Typography>
          </Alert>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 2, pt: 1.5, gap: 1, 
          flexDirection: { xs: "column-reverse", sm: "row"} 
        }}>
          <Button 
            onClick={handleCloseDialog}
            color="inherit"
            size="small"
            variant='outlined'
          >
            Chiudi
          </Button>
          <Button 
            variant="contained" 
            startIcon={<DownloadIcon />}
            onClick={() => {
              handleDownload();
              handleCloseDialog();
            }}
            sx={{ 
              fontWeight: 600,
            }}
            size="small"
          >
            Scarica Liberatoria
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}