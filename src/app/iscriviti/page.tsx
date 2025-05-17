import { Box } from "@mui/material";
import IscrizioneWizard from "../../components/IscrizioneWizard";

export default function Iscriviti() {
  return (
    <Box component="main" sx={{
      pt: "8rem",
      pb: 4
    }}>
      <IscrizioneWizard />
    </Box>
  );
}
