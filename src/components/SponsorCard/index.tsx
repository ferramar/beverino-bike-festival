// components/SponsorCard.js
import React from "react";
import PropTypes from "prop-types";
import {
  Typography,
  Button,
  Link as MuiLink,
  Box,
} from "@mui/material";
import Image from "next/image";

export default function SponsorCard({ sponsor }: any) {
  const { nome, logo, sito, descrizione } = sponsor;

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
      }}
    >
      {logo && (
        <Box sx={{
          width: "150px",
          height: "100px",
          position: "relative",
          flexShrink: 0
        }}>
          <Image src={logo} alt="logo" fill style={{ objectFit: "contain" }} />
        </Box>
      )}

      <Box sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="h3"
        >
          {nome}
        </Typography>
        {descrizione && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {descrizione}
          </Typography>
        )}
        {sito && (
          <Box sx={{ mt: 2 }}>
            <MuiLink
              href={sito}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
            >
              <Button size="small" variant="contained">
                Visita il sito
              </Button>
            </MuiLink>
          </Box>
        )}
      </Box>
    </Box>
  );
}

SponsorCard.propTypes = {
  sponsor: PropTypes.shape({
    nome: PropTypes.string.isRequired,
    logo: PropTypes.string,
    sito: PropTypes.string,
    descrizione: PropTypes.string,
  }).isRequired,
};
