"use client"
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Fade,
  Slide,
  useScrollTrigger,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Timeline,
  CalendarMonth,
  Collections,
  Handshake,
  DirectionsBike,
  HelpOutline,
  LocalOffer,
  CardGiftcard,
} from '@mui/icons-material';
import Link from 'next/link';
import { isRegistrationOpen } from '../../utils/isRegistrationOpen';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// Hook per rilevare lo scroll
function useScrollPosition() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrolled;
}

// Componente per nascondere header on scroll down
function HideOnScroll({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger({
    threshold: 100,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function ModernHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScrollPosition();
  const pathname = usePathname();

  const navItems = [
    { href: "/percorsi", label: "Percorsi", icon: <Timeline /> },
    { href: "/programma", label: "Programma", icon: <CalendarMonth /> },
    { href: "/convenzioni", label: "Convenzioni", icon: <LocalOffer /> },
    { href: "/lotteria", label: "Lotteria", icon: <CardGiftcard /> },
    { href: "/galleria", label: "Galleria", icon: <Collections /> },
    { href: "/sponsor", label: "Sponsor", icon: <Handshake /> },
    // { href: "/faq", label: "FAQ", icon: <HelpOutline /> },
  ];

  // Funzione per ottenere il nome della pagina corrente
  const getCurrentPageName = () => {
    if (pathname === '/') return 'Home';
    if (pathname === '/iscriviti') return 'Iscrizioni';
    const currentItem = navItems.find(item => item.href === pathname);
    return currentItem?.label || 'Pagina';
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Funzione per verificare se il link è attivo
  const isActive = (href: string) => {
    return pathname === href;
  };

  const drawer = (
    <Box sx={{ width: 280 }}>
      {/* Header del drawer */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #A52D0C 0%, #D32F2F 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <DirectionsBike sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Beverino Bike
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Festival 2025
          </Typography>
        </Box>
      </Box>

      {/* Menu items */}
      <List sx={{ px: 2, py: 3 }}>
        {navItems.map((item) => (
          <ListItem key={item.href} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              href={item.href}
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                bgcolor: isActive(item.href) ? '#A52D0C' : 'transparent',
                color: isActive(item.href) ? 'white' : 'inherit',
                '& .MuiListItemIcon-root': {
                  color: isActive(item.href) ? 'white' : 'inherit',
                },
                '&:hover': {
                  bgcolor: isActive(item.href) ? '#D32F2F' : 'rgba(165, 45, 12, 0.1)',
                  color: isActive(item.href) ? 'white' : '#A52D0C',
                  '& .MuiListItemIcon-root': {
                    color: isActive(item.href) ? 'white' : '#A52D0C',
                  },
                },
                transition: 'all 0.3s ease',
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive(item.href) ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* CTA Button nel drawer */}
      {isRegistrationOpen() && (
        <Box sx={{ p: 3 }}>
          <Button
            component={Link}
            href="/iscriviti"
            variant="contained"
            fullWidth
            size="large"
            onClick={handleDrawerToggle}
            sx={{
              background: isActive('/iscriviti')
                ? 'linear-gradient(135deg, #D32F2F 0%, #E53935 100%)'
                : 'linear-gradient(135deg, #A52D0C 0%, #D32F2F 100%)',
              borderRadius: 3,
              py: 1.5,
              boxShadow: '0 4px 15px rgba(191, 54, 12, 0.3)',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px rgba(191, 54, 12, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Iscriviti ora
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {/* H1 nascosto per accessibilità */}
      <Typography
        variant="h1"
        component="h1"
        sx={visuallyHidden}
      >
        Beverino Bike Festival - {getCurrentPageName()}
      </Typography>
      <HideOnScroll>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderBottom: scrolled ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: scrolled ? 'scale(0.98)' : 'scale(1)',
            borderRadius: '0',
            margin: '0',
            width: '100%',
            boxShadow: scrolled
              ? '0 8px 32px rgba(0, 0, 0, 0.12)'
              : '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Container maxWidth="lg">
            <Toolbar
              sx={{
                height: { xs: 64, md: 72 },
                px: { xs: 2, md: 3 },
              }}
            >
              {/* Logo */}
              <Box
                component={Link}
                href="/"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                  transition: 'transform 0.2s ease',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src="/logo.png"
                    alt="Logo Beverino Bike Festival"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography
                    variant="h6"
                    component={"span"}
                    sx={{
                      fontWeight: 700,
                      color: '#333',
                      fontSize: scrolled ? '1.1rem' : '1.25rem',
                      transition: 'font-size 0.3s ease',
                    }}
                  >
                    Beverino Bike Festival
                  </Typography>
                </Box>
              </Box>

              {/* Spacer */}
              <Box sx={{ flexGrow: 1 }} />

              {/* Desktop Navigation */}
              <Box
                component={"nav"}
                sx={{
                  display: { xs: 'none', lg: 'flex' },
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {navItems.map((item) => (
                  <Box
                    key={item.href}
                    component={Link}
                    href={item.href}
                    sx={{
                      color: isActive(item.href) ? '#A52D0C' : '#333',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: isActive(item.href) ? 700 : 500,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        right: 0,
                        height: 3,
                        backgroundColor: '#A52D0C',
                        borderRadius: 2,
                        transform: isActive(item.href) ? 'scaleX(1)' : 'scaleX(0)',
                        transition: 'transform 0.3s ease',
                      },
                      '&:hover': {
                        color: '#A52D0C',
                        '&::after': {
                          transform: 'scaleX(1)',
                        },
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.label}
                  </Box>
                ))}

                {/* CTA Button */}
                {isRegistrationOpen() && (
                  <Button
                    component={Link}
                    href="/iscriviti"
                    variant="contained"
                    sx={{
                      ml: 2,
                      backgroundColor: isActive('/iscriviti') ? '#D32F2F' : '#A52D0C',
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: isActive('/iscriviti') ? '0 0 0 2px rgba(211, 47, 47, 0.3)' : 'none',
                      '&:hover': {
                        backgroundColor: '#D32F2F',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(165, 45, 12, 0.25)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                    aria-label="Iscriviti ora"
                  >
                    Iscriviti ora
                  </Button>
                )}
              </Box>

              {/* Mobile menu button */}
              <IconButton
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  display: { lg: 'none' },
                  color: '#FF5722',
                  bgcolor: 'rgba(255, 87, 34, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(191, 54, 12, 0.2)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)',
          },
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {/* Close button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        {drawer}
      </Drawer>

      {/* Spacer per il contenuto */}
      <Toolbar sx={{ height: { xs: 64, md: 72 } }} />
    </>
  );
}