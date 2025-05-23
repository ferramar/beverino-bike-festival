"use client"
import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { CalendarMonth, Collections, Handshake, Timeline } from '@mui/icons-material';
import Link from 'next/link';
import theme from '../../theme';
import { useState } from 'react';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function Header() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const navItems = [
    { href: "/percorsi", label: "Percorsi", icon: <Timeline /> },
    { href: "/programma", label: "Programma", icon: <CalendarMonth /> },
    { href: "/galleria", label: "Galleria", icon: <Collections /> },
    { href: "/sponsor", label: "Sponsor", icon: <Handshake /> },
  ];

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
        zIndex: "1000"
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters sx={{
          background: theme.palette.background.paper
        }}>
          <Box sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: "space-between",
            px: 0,
            "& > a": {
              display: "flex",
              alignItems: "center",
              gap: 2,
              color: theme.palette.text.primary,
              "& > svg": {
                width: "20px",
                height: "20px",
                color: theme.palette.text.primary
              }
            }
          }}>
            <Link href="/">
              <Box
                component={'svg'}
                sx={{
                  color: "red"
                }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6"
                />
              </Box>
              <span>Logo</span>
            </Link>
            <Box sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: "center",
              gap: 4,
              "& > .nav-link": {
                color: theme.palette.text.primary,
              }
            }}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-link"
                >
                  {item.label}
                </Link>
              ))}
              <Button LinkComponent={Link} href='/iscriviti' color="primary" variant="contained" size="medium" sx={{
                display: { xs: 'none', md: 'flex' },
              }}>
                Iscriviti ora
              </Button>
            </Box>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: "space-between",
                    px: 2,
                    "& > a": {
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      color: theme.palette.text.primary,
                      "& > svg": {
                        width: "20px",
                        height: "20px",
                        color: theme.palette.text.primary
                      }
                    }
                  }}>
                    <Link href="/" onClick={toggleDrawer(false)}>
                      <Box
                        component={'svg'}
                        sx={{
                          color: "red"
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6"
                        />
                      </Box>
                      <span>Logo</span>
                    </Link>
                    <Box sx={{
                      display: { xs: 'none', md: 'flex' },
                      alignItems: "center",
                      gap: 4,
                      "& > .nav-link": {
                        color: theme.palette.text.primary,
                      }
                    }}>
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="nav-link"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <Button LinkComponent={Link} href='/iscriviti' color="primary" variant="contained" size="medium" sx={{
                        display: { xs: 'none', md: 'flex' },
                      }}>
                        Iscriviti ora
                      </Button>
                    </Box>
                  </Box>
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                {navItems.map((item) => (
                  <MenuItem key={item.href} onClick={toggleDrawer(false)}>
                    <Link href={item.href}>
                      {item.label}
                    </Link>
                  </MenuItem>
                ))}
                <Divider sx={{ my: 3 }} />
                <MenuItem onClick={toggleDrawer(false)}>
                  <Button LinkComponent={Link} href='/iscriviti' color="primary" variant="contained" size="small" sx={{
                    width: { xs: "100%" }
                  }}>
                    Iscriviti ora
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
