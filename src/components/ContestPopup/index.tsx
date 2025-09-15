"use client";
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
  Box,
  Dialog,
  IconButton,
  Button,
} from '@mui/material';
import {
  Close as CloseIcon,
} from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const ContestPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenPopup, setHasSeenPopup] = useLocalStorage('beverino-contest-popup-seen', false);

  useEffect(() => {
    // Mostra il pop-up solo se l'utente non l'ha mai visto
    if (!hasSeenPopup) {
      // Mostra il pop-up dopo un breve delay per permettere al sito di caricarsi
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [hasSeenPopup]);

  // Gestisce lo scroll del body quando il pop-up è aperto
  useEffect(() => {
    const preventScroll = (e: Event) => {
      // Permette lo scroll solo all'interno della modale
      const target = e.target as Element;
      const modalContent = document.querySelector('[data-modal-content]');
      
      if (modalContent && modalContent.contains(target)) {
        return; // Permette lo scroll all'interno della modale
      }
      
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    if (isOpen) {
      // Salva la posizione di scroll attuale
      const scrollY = window.scrollY;
      
      // Previene lo scroll del body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.touchAction = 'none';
      
      // Previene anche lo scroll su html
      document.documentElement.style.overflow = 'hidden';
      
      // Salva la posizione per il ripristino
      document.body.setAttribute('data-scroll-y', scrollY.toString());
      
      // Aggiunge event listeners per prevenire lo scroll (solo fuori dalla modale)
      document.addEventListener('wheel', preventScroll, { passive: false });
      document.addEventListener('touchmove', preventScroll, { passive: false });
      document.addEventListener('keydown', (e) => {
        if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
          e.preventDefault();
        }
      });
    } else {
      // Rimuove gli event listeners
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
      
      // Ripristina lo scroll del body
      const scrollY = document.body.getAttribute('data-scroll-y');
      
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.touchAction = '';
      document.body.removeAttribute('data-scroll-y');
      
      document.documentElement.style.overflow = '';
      
      // Ripristina la posizione di scroll
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY, 10));
      }
    }

    // Cleanup quando il componente viene smontato
    return () => {
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
      
      const scrollY = document.body.getAttribute('data-scroll-y');
      
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.touchAction = '';
      document.body.removeAttribute('data-scroll-y');
      
      document.documentElement.style.overflow = '';
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY, 10));
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    // Salva nel localStorage che l'utente ha visto il pop-up
    setHasSeenPopup(true);
  };


  // Gestisce il focus quando il pop-up si apre
  useEffect(() => {
    if (isOpen) {
      // Focus sul pulsante di chiusura per accessibilità
      const closeButton = document.querySelector('[aria-label="Chiudi pop-up"]') as HTMLElement;
      if (closeButton) {
        closeButton.focus();
      }
    }
  }, [isOpen]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <Dialog
          key="contest-popup"
          open={isOpen}
          onClose={handleClose}
          maxWidth={false}
          fullWidth
          fullScreen={false}
          scroll="body"
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: { xs: 2, sm: 3 },
              overflow: 'hidden',
              position: 'relative',
              maxHeight: { xs: '85vh', sm: '85p vh' },
              width: { xs: 'calc(100vw - 16px)', sm: 'auto' },
              height: 'auto',
              maxWidth: { xs: 'calc(100vw - 16px)', sm: 'max-content' },
              minWidth: { xs: 'auto', sm: '400px' },
              display: 'flex',
              flexDirection: 'column',
              margin: { xs: '8px auto', sm: '16px auto' },
              marginLeft: 'auto',
              marginRight: 'auto',
            },
          }}
          BackdropProps={{
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
            },
            onClick: handleClose,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Box
              sx={{
                position: 'relative',
                background: 'white',
                overflow: 'hidden',
              }}
            >
              {/* Pulsante chiudi */}
              <IconButton
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  top: { xs: 8, sm: 12 },
                  right: { xs: 8, sm: 12 },
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  width: { xs: 36, sm: 44 },
                  height: { xs: 36, sm: 44 },
                  zIndex: 10,
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                  },
                }}
                aria-label="Chiudi pop-up"
              >
                <CloseIcon sx={{ fontSize: { xs: 22, sm: 26 } }} />
              </IconButton>

              {/* Immagine del poster */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  maxHeight: { xs: 'calc(85vh - 120px)', sm: 'calc(85vh - 120px)' },
                  minHeight: { xs: 'auto', sm: '500px' },
                }}
              >
                <Image
                  src="/lotteria.jpeg"
                  alt="Beverino Bike Festival - Pedala & Vinci!"
                  width={800}
                  height={1200}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: 'calc(85vh - 120px)',
                    maxWidth: '100%',
                    objectFit: 'contain',
                  }}
                  priority
                />
              </Box>

              {/* Pulsante Scopri di più */}
              <Box
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Button
                  component={Link}
                  href="/lotteria"
                  variant="contained"
                  fullWidth
                  onClick={handleClose}
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: '0 4px 20px rgba(165, 45, 12, 0.3)',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 25px rgba(165, 45, 12, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Scopri di più
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Dialog>
      )}
      
    </AnimatePresence>
  );
};

export default ContestPopup;
