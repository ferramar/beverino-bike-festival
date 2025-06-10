"use client";

import React from "react";
import { Container, Grid, Typography } from "@mui/material";
import SponsorCard from "@/components/SponsorCard";

export default function SponsorList({ sponsors }: any) {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        I nostri Sponsor
      </Typography>

      {sponsors?.length === 0 ? (
        <Typography variant="body1" align="center" color="text.secondary">
          Al momento non ci sono sponsor registrati.
        </Typography>
      ) : (
        <Grid container spacing={3} mt={6}>
          {sponsors?.map((sponsor: any) => (
            <Grid key={sponsor.id} size={{ xs: 12, md: 6 }}>
              <SponsorCard sponsor={sponsor} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
