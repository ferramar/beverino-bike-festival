import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useFormContext } from 'react-hook-form';

const RACE_PRICE = 50;
const PASTA_PRICE = 20;

/**
 * Componente per il recap delle opzioni di pagamento,
 * integrato nello stesso form di React Hook Form usato negli step precedenti.
 */
export default function FinalRegistrationStep() {
  const { control, watch, setValue } = useFormContext();

  // Valori dal form
  const option = watch('paymentOption', 'race-only');
  const pastaCount = watch('pastaPartyCount', 1);

  // Calcolo prezzo totale
  const totalPrice =
    option === 'race-only'
      ? RACE_PRICE
      : RACE_PRICE + pastaCount * PASTA_PRICE;

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" align="center" gutterBottom>
        Scegli il tipo di iscrizione
      </Typography>
      <Grid container spacing={2}>
        {/** Opzione Solo Gara */}
        <Grid size={{xs: 12, sm: 6}}>
          <Card
            sx={theme => ({
              border:
                option === 'race-only'
                  ? `2px solid ${theme.palette.warning.main}`
                  : '1px solid rgba(0,0,0,0.12)',
            })}
          >
            <CardActionArea onClick={() => setValue('paymentOption', 'race-only')}>
              <CardContent>
                <Typography variant="h6">Solo Gara</Typography>
                <Typography>€{RACE_PRICE}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/** Opzione Gara + Pasta Party */}
        <Grid size={{xs: 12, sm: 6}}>
          <Card
            sx={theme => ({
              border:
                option === 'race-pasta'
                  ? `2px solid ${theme.palette.warning.main}`
                  : '1px solid rgba(0,0,0,0.12)',
            })}
          >
            <CardActionArea onClick={() => setValue('paymentOption', 'race-pasta')}>
              <CardContent>
                <Typography variant="h6">Gara + Pasta Party</Typography>
                <Typography>€{RACE_PRICE} + €{PASTA_PRICE}/pax</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      {option === 'race-pasta' && (
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Numero persone Pasta Party"
            type="number"
            value={pastaCount}
            onChange={(e) => setValue('pastaPartyCount', Math.max(1, parseInt(e.target.value, 10) || 1))}
            inputProps={{ min: 1 }}
            fullWidth
          />
        </Box>
      )}

      <Typography variant="h6" align="right" sx={{ mt: 2 }}>
        Totale: €{totalPrice}
      </Typography>
    </Box>
  );
}
