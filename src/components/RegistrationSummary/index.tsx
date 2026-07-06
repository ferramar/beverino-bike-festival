'use client';

import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useFormContext } from 'react-hook-form';
import { getGaraDisplayName } from '@/config/liberatorie';
import { calculateOrderTotal } from '@/config/pricing';
import { PRICING } from '@/config/event';

interface RegistrationSummaryProps {
  onEditDataSubStep?: (subStep: number) => void;
}

function SummaryRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Grid>
  );
}

export default function RegistrationSummary({ onEditDataSubStep }: RegistrationSummaryProps) {
  const { watch } = useFormContext();
  const data = watch();

  const tipoGaraLabel = data.tipo_gara ? getGaraDisplayName(data.tipo_gara) : '—';
  const pastaCount = data.pasta_party_enabled ? data.conteggio_pastaparty || 0 : 0;
  const total = calculateOrderTotal(data.tipo_gara, pastaCount);

  const docType = (t?: string) =>
    t === 'cartaIdentita' ? "Carta d'identità" : t === 'patente' ? 'Patente' : t || '—';

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Riepilogo iscrizione
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Controlla i dati prima di firmare la liberatoria. Puoi tornare indietro per modificarli.
      </Typography>

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Opzioni
            </Typography>
            <Button size="small" startIcon={<EditIcon />} onClick={() => onEditDataSubStep?.(-1)}>
              Modifica
            </Button>
          </Box>
          <Grid container spacing={2}>
            <SummaryRow label="Gara" value={tipoGaraLabel} />
            {data.taglia_maglietta && (
              <SummaryRow label="Taglia maglietta" value={data.taglia_maglietta} />
            )}
            {pastaCount > 0 && (
              <SummaryRow label="Pasta Party" value={`${pastaCount} persona/e (€${PRICING.pastaParty} cad.)`} />
            )}
            <SummaryRow label="Totale" value={`€${total.toFixed(2)}`} />
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Anagrafica
            </Typography>
            <Button size="small" startIcon={<EditIcon />} onClick={() => onEditDataSubStep?.(0)}>
              Modifica
            </Button>
          </Box>
          <Grid container spacing={2}>
            <SummaryRow label="Codice fiscale" value={data.codiceFiscale} />
            <SummaryRow label="Nome" value={data.nome} />
            <SummaryRow label="Cognome" value={data.cognome} />
            <SummaryRow label="Nato/a a" value={data.luogoNascita} />
            <SummaryRow
              label="Data di nascita"
              value={data.dataNascita ? new Date(data.dataNascita).toLocaleDateString('it-IT') : ''}
            />
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Residenza
            </Typography>
            <Button size="small" startIcon={<EditIcon />} onClick={() => onEditDataSubStep?.(1)}>
              Modifica
            </Button>
          </Box>
          <Grid container spacing={2}>
            <SummaryRow label="Comune" value={data.comuneResidenza} />
            <SummaryRow
              label="Indirizzo"
              value={[data.residenza, data.numeroCivico].filter(Boolean).join(' ')}
            />
            <SummaryRow label="CAP" value={data.cap} />
            <SummaryRow label="Email" value={data.email} />
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Documento
            </Typography>
            <Button size="small" startIcon={<EditIcon />} onClick={() => onEditDataSubStep?.(2)}>
              Modifica
            </Button>
          </Box>
          <Grid container spacing={2}>
            <SummaryRow label="Tipo documento" value={docType(data.tipoDocumento)} />
            <SummaryRow label="Numero" value={data.numeroDocumento} />
            <SummaryRow label="Rilasciato a" value={data.cittaRilascio} />
            <SummaryRow
              label="Data rilascio"
              value={
                data.dataRilascioDocumento
                  ? new Date(data.dataRilascioDocumento).toLocaleDateString('it-IT')
                  : ''
              }
            />
          </Grid>

          {data.nomeGenitore && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Genitore/tutore
              </Typography>
              <Grid container spacing={2}>
                <SummaryRow
                  label="Genitore"
                  value={`${data.nomeGenitore} ${data.cognomeGenitore || ''}`.trim()}
                />
                <SummaryRow label="Email genitore" value={data.emailGenitore} />
              </Grid>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
