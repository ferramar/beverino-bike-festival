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
        minHeight: "600px",
        height: { xs: "80svh", lg: "90svh" },
        maxHeight: "900px",
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
          <Box sx={{ maxWidth: "700px" }}>
            {/* Badge */}
            <Chip 
                label="ISCRIZIONI APERTE" 
                color="success" 
                size="small"
                sx={{
                  mb: 3,
                  animation: `${fadeInUp} 0.8s ease-out forwards`,
                  fontWeight: 600,
                  letterSpacing: 1,
                }}
              />

              {/* Data e Luogo */}
              <Box sx={{ 
                display: "flex", 
                gap: 3, 
                mb: 3,
                flexWrap: "wrap",
                animation: `${fadeInUp} 0.8s ease-out 0.2s forwards`,
                opacity: 0,
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarMonthIcon sx={{ color: 'white' }} aria-hidden="true" />
                  <Typography
                    component="time"
                    dateTime="2025-09-21"
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: 'white',
                    }}
                  >
                    21 Settembre 2025
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOnIcon sx={{ color: 'white' }} aria-hidden="true" />
                  <Typography
                    component="address"
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: 'white',
                      fontStyle: 'normal',
                    }}
                  >
                    Beverino, La Spezia
                  </Typography>
                </Box>
              </Box>

              {/* Titolo */}
              <Typography 
                variant="h1" 
                sx={{
                  fontSize: { xs: "3rem", md: "4rem", lg: "5rem" },
                  mb: 3,
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
                  fontSize: { xs: "1.125rem", md: "1.25rem", lg: "1.5rem" },
                  mb: 4,
                  lineHeight: 1.6,
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

              {/* CTA Buttons */}
              <Box sx={{ 
                display: "flex", 
                gap: 2, 
                flexWrap: "wrap",
                animation: `${fadeInUp} 0.8s ease-out 0.8s forwards`,
                opacity: 0,
              }}>
                <Button 
                  component={Link} 
                  href='/iscriviti' 
                  variant="contained" 
                  size="large"
                  aria-label="Iscriviti ora al Beverino Bike Festival 2025"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1.125rem",
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
                <Button 
                  component={Link} 
                  href='/programma' 
                  variant="outlined" 
                  size="large"
                  aria-label="Scopri il programma del Beverino Bike Festival 2025"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1.125rem",
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
                </Button>
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