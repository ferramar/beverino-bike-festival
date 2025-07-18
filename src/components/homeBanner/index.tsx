"use client";
import { Box, Button, Container, Typography, Chip } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { keyframes } from '@mui/system';

// Animazioni
const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

export default function HomeBanner() {
  return (
    <Box
      component="section"
      aria-label="Banner principale - Beverino Bike Festival 2025"
      sx={{
        minHeight: "700px",
        height: { xs: "100svh", lg: "90svh" },
        maxHeight: { xs: "700px", lg: "900px" },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Image con effetto parallax */}
      <Box sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "120%",
        height: "120%",
        transform: "translate(-10%, -10%)",
        zIndex: 1,
        background: "#000",
        "& > img": {
          objectFit: "cover",
          filter: "brightness(0.85)",
        },
        "&:after": {
          content: "''",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 10,
          width: "100%",
          height: "100%",
          background: `
            linear-gradient(
              135deg,
              rgba(0,0,0,0.7) 0%,
              rgba(0,0,0,0.4) 50%,
              rgba(0,0,0,0.2) 100%
            ),
            linear-gradient(
              to bottom,
              rgba(0,0,0,0.2) 0%,
              rgba(0,0,0,0) 50%,
              rgba(0,0,0,0.4) 100%
            )
          `
        }
      }}>
        <Image
          src="/banner.jpg"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
        />
      </Box>

      {/* Content */}
      <Box sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 2,
        display: "flex",
        alignItems: "center",
      }}>
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: { xs: "100%", md: "700px" } }}>
            {/* Organizzatore con predisposizione logo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 2,
                animation: `${fadeInUp} 0.6s ease-out forwards`,
              }}
            >
              {/* Logo placeholder - decommentare quando disponibile */}
              <Image
                src="/beverino-bikers-logo.png"
                alt="Beverino Bikers"
                width={100}
                height={100}
                style={{
                  objectFit: 'contain',
                  marginLeft: "-10px"
                }}
              />
              
              <Typography
                variant="caption"
                sx={{
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                Beverino Bikers presenta
              </Typography>
            </Box>

            {/* Data e Luogo */}
            <Box sx={{
              display: "flex",
              gap: { xs: 2, md: 3 },
              mb: { xs: 2, md: 3 },
              flexWrap: "wrap",
              animation: `${fadeInUp} 0.8s ease-out 0.2s forwards`,
              opacity: 0,
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarMonthIcon sx={{ color: 'white', fontSize: { xs: 20, md: 24 } }} aria-hidden="true" />
                <Typography
                  component="time"
                  dateTime="2025-09-21"
                  variant="h6"
                  sx={{
                    fontWeight: 500,
                    color: 'white',
                    fontSize: { xs: '0.875rem', md: '1.25rem' },
                  }}
                >
                  21 Settembre 2025
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOnIcon sx={{ color: 'white', fontSize: { xs: 20, md: 24 } }} aria-hidden="true" />
                <Typography
                  component="address"
                  variant="h6"
                  sx={{
                    fontWeight: 500,
                    color: 'white',
                    fontStyle: 'normal',
                    fontSize: { xs: '0.875rem', md: '1.25rem' },
                  }}
                >
                  Beverino, La Spezia
                </Typography>
              </Box>
            </Box>

            {/* Titolo */}
            <Typography
              component={"h2"}
              sx={{
                fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem" },
                mb: { xs: 2, md: 3 },
                fontWeight: 800,
                lineHeight: 1.1,
                animation: `${slideInLeft} 0.8s ease-out 0.4s forwards`,
                opacity: 0,
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                color: 'white',
              }}
            >
              Beverino Bike Festival
            </Typography>

            {/* Sottotitolo */}
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem", lg: "1.5rem" },
                mb: { xs: 3, md: 4 },
                lineHeight: 1.4,
                animation: `${fadeInUp} 0.8s ease-out 0.6s forwards`,
                opacity: 0,
                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                color: 'white',
              }}
            >
              Partecipa alla nostra epica gara ciclistica attraverso paesaggi
              mozzafiato e sfida te stesso sui percorsi che abbiamo creato
              per tutti i livelli di esperienza.
            </Typography>

            {/* CTA Buttons - RIDOTTI */}
            <Box sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              animation: `${fadeInUp} 0.8s ease-out 0.8s forwards`,
              opacity: 0,
              mb: { xs: 3, md: 0 },
            }}>
              <Button
                component={Link}
                href='/iscriviti'
                variant="contained"
                size="medium" // Ridotto da large
                aria-label="Iscriviti ora al Beverino Bike Festival 2025"
                sx={{
                  px: { xs: 2.5, md: 3 }, // Ridotto
                  py: { xs: 0.75, md: 1 }, // Ridotto
                  fontSize: { xs: "0.875rem", md: "1rem" }, // Ridotto
                  fontWeight: 600,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 25px rgba(0,0,0,0.3)",
                  },
                  "&:focus-visible": {
                    outline: "3px solid #FB6616",
                    outlineOffset: "2px",
                  }
                }}
              >
                Iscriviti Ora
              </Button>
              {/* da decommentare */}
              {/* <Button
                component={Link}
                href='/programma'
                variant="outlined"
                size="medium" // Ridotto da large
                aria-label="Scopri il programma del Beverino Bike Festival 2025"
                sx={{
                  px: { xs: 2.5, md: 3 }, // Ridotto
                  py: { xs: 0.75, md: 1 }, // Ridotto
                  fontSize: { xs: "0.875rem", md: "1rem" }, // Ridotto
                  fontWeight: 600,
                  borderWidth: 2,
                  borderColor: 'white',
                  color: 'white',
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderWidth: 2,
                    borderColor: 'white',
                    transform: "translateY(-2px)",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                  "&:focus-visible": {
                    outline: "3px solid #FB6616",
                    outlineOffset: "2px",
                  }
                }}
              >
                Scopri il Programma
              </Button> */}
            </Box>

            {/* Main Sponsor */}
            <Box sx={{
              mt: { xs: 4, md: 6 },
              animation: `${fadeInUp} 0.8s ease-out 1s forwards`,
              opacity: 0,
            }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'white',
                  mb: 1.5,
                  textTransform: 'uppercase',
                  letterSpacing: { xs: 1.5, md: 2 },
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                  fontWeight: 500,
                  opacity: 0.9,
                }}
              >
                Main Sponsor
              </Typography>
              <Box
                component={Link}
                href='/sponsor'
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 2,
                  px: { xs: 2, md: 3 },
                  py: { xs: 1.5, md: 2 },
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 25px rgba(0,0,0,0.3)',
                  },
                }}
              >
                <Image
                  src="/damiani-ottica-logo.webp"
                  alt="Damiani Ottica - Main Sponsor"
                  width={150}
                  height={50}
                  style={{
                    objectFit: 'contain',
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '150px',
                    maxHeight: '50px',
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Scroll indicator - solo desktop */}
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 3,
          animation: `${fadeInUp} 1s ease-out 1s forwards`,
          opacity: 0,
          display: { xs: 'none', md: 'block' } // Nascosto su mobile
        }}
      >
        <Box sx={{
          width: 30,
          height: 50,
          border: "2px solid",
          borderColor: "white",
          borderRadius: 15,
          position: "relative",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 8,
            left: "50%",
            width: 4,
            height: 10,
            backgroundColor: "white",
            borderRadius: 2,
            transform: "translateX(-50%)",
            animation: "scrollDown 1.5s ease-in-out infinite",
          },
          "@keyframes scrollDown": {
            "0%": { transform: "translateX(-50%) translateY(0)", opacity: 1 },
            "100%": { transform: "translateX(-50%) translateY(20px)", opacity: 0 },
          }
        }} />
      </Box>
    </Box>
  );
}