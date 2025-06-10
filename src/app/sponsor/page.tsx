"use client"

import { Box } from "@mui/material";
import SponsorList from "./SponsorList";
import useSWR from "swr";
import { getAllSponsors } from "../../utils/api";

export default function Sponsor() {
  const { data, error } = useSWR('/api/sponsors', getAllSponsors);

  if (error) return <Box p={2}>Errore caricamento</Box>;
  if (!data) return <Box p={2}>Loading...</Box>;

  return (
    <Box component="main" sx={{
      pt: "8rem",
      pb: 4
    }}>
      {data?.length && <SponsorList sponsors={data} />}
    </Box>
  );
}
