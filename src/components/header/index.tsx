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
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Timeline,
  CalendarMonth,
  Collections,
  Handshake,
  DirectionsBike,
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';

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

  const navItems = [
    { href: "/percorsi", label: "Percorsi", icon: <Timeline /> },
    { href: "/programma", label: "Programma", icon: <CalendarMonth /> },
    { href: "/galleria", label: "Galleria", icon: <Collections /> },
    { href: "/sponsor", label: "Sponsor", icon: <Handshake /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 280 }}>
      {/* Header del drawer */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #BF360C 0%, #D32F2F 100%)',
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
                '&:hover': {
                  bgcolor: '#BF360C',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                transition: 'all 0.3s ease',
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* CTA Button nel drawer */}
      <Box sx={{ p: 3 }}>
        <Button
          component={Link}
          href="/iscriviti"
          variant="contained"
          fullWidth
          size="large"
          onClick={handleDrawerToggle}
          sx={{
            background: 'linear-gradient(135deg, #BF360C 0%, #D32F2F 100%)',
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
    </Box>
  );

  return (
    <>
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
                    alt="Beverino Bike Festival"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography
                    variant="h6"
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
                sx={{
                  display: { xs: 'none', md: 'flex' },
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
                      color: '#333',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      '&:hover': {
                        color: '#BF360C',
                      },
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {item.label}
                  </Box>
                ))}

                {/* CTA Button */}
                <Button
                  component={Link}
                  href="/iscriviti"
                  variant="contained"
                  sx={{
                    ml: 2,
                    backgroundColor: '#BF360C',
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#D32F2F',
                    },
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  Iscriviti ora
                </Button>
              </Box>

              {/* Mobile menu button */}
              <IconButton
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  display: { md: 'none' },
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
          display: { xs: 'block', md: 'none' },
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