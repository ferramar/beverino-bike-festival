import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import TerrainIcon from '@mui/icons-material/Terrain';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const features = [
  {
    icon: <DirectionsBikeIcon sx={{ fontSize: 48 }} />,
    title: "3 Percorsi MTB ed 1 running",
    description: "Scegli tra percorsi da 30km, 35km e 50km adatti a ogni livello di preparazione, ed un percorso dedicato alla corsa"
  },
  {
    icon: <TerrainIcon sx={{ fontSize: 48 }} />,
    title: "Paesaggi Unici",
    description: "Attraversa colline, vigneti e borghi storici della Val di Vara"
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 48 }} />,
    title: "Community",
    description: "Unisciti a oltre 500 ciclisti appassionati da tutta Italia"
  },
  {
    icon: <EmojiEventsIcon sx={{ fontSize: 48 }} />,
    title: "Premi e Ristori",
    description: "Ricchi premi per i vincitori e ristori con prodotti locali lungo il percorso"
  }
];

export default function FeaturesSection() {
  return (
    <Box sx={{ py: 10, background: 'white' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ 
            mb: 6, 
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' }
          }}
        >
          Perché Partecipare
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{xs: 12, sm: 6, md: 3}} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  border: '1px solid',
                  borderColor: 'grey.200',
                  borderRadius: 2,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    borderColor: 'primary.main',
                    '& .icon': {
                      color: 'primary.main',
                      transform: 'scale(1.1)',
                    }
                  }
                }}
              >
                <Box
                  className="icon"
                  sx={{
                    color: 'grey.600',
                    mb: 2,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}