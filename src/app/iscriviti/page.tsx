"use client"

import { Box, Container } from "@mui/material";
import DataForm from "../../components/dataForm";

export default function Iscriviti() {

  return (
    <Box component="main" sx={{
      pt: "8rem",
    }}>
      <Container maxWidth="lg">
        <DataForm />
      </Container>
    </Box>
  );
}
