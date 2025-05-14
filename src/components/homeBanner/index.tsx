import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function HomeBanner() {
  return (
    <Box sx={{
      minHeight: "500px",
      height: {xs: "80svh", lg: "80svh"},
      maxHeight: "700px",
      position: "relative",
    }}>
      <Box sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        "& > img": {
          objectFit: "cover"
        },
        "&:after": {
          content: "''",
          position: "absolute",
          top: 0,
          left: 0,
          // background: "red",
          zIndex: 10,
          width: "100%",
          height: "100%",
          backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)"
        }
      }}>
        <Image
          src={"/banner.jpg"}
          alt="Banner Background"
          fill
          priority
        />
      </Box>
      <Box sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 2,
        pt: "8rem",
        display: "flex",
        alignItems: "center"
      }}>
        <Container maxWidth="lg">
          <Typography variant="h1" color="text.secondary" sx={{
            maxWidth: "600px",
            fontSize: { xs: "3rem", lg: "4rem" },
            mb: 3
          }}>Beverino Bike Festival</Typography>
          <Typography variant="body1" color="text.secondary" sx={{
            maxWidth: "600px",
            fontSize: { xs: "1.25rem", lg: "1.5rem" },
            mb: 3
          }}>Partecipa alla nostra epica gara ciclistica attraverso paesaggi mozzafiato e sfida te stesso sui percorsi che abbiamo creato.</Typography>
          <Button LinkComponent={Link} href='/iscriviti' variant="contained" size="large" sx={{
            width: {xs: "100%", sm: "auto"}
          }}>Iscriviti ora</Button>
        </Container>
      </Box>
    </Box>
  )
}