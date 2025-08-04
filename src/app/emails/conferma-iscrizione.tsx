// app/emails/conferma-iscrizione.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from '@react-email/components';
import * as React from 'react';

interface ConfermaIscrizioneEmailProps {
  nome: string;
  cognome: string;
  tipo_gara: 'ciclistica' | 'running';
  includesPastaParty: boolean;
  numeroPartecipantiPastaParty?: number;
  importoTotale: number;
  codiceRegistrazione: string;
}

export const ConfermaIscrizioneEmail = ({
  nome,
  cognome,
  tipo_gara,
  includesPastaParty,
  numeroPartecipantiPastaParty = 0,
  importoTotale,
  codiceRegistrazione,
}: ConfermaIscrizioneEmailProps) => {
  const previewText = `Conferma iscrizione Beverino Bike Festival - ${nome} ${cognome}`;
  const tipoGaraText = tipo_gara === 'ciclistica' ? 'Raduno ciclistico' : 'Raduno running';
  const prezzoGara = tipo_gara === 'ciclistica' ? 20 : 10;
  const prezzoPastaParty = numeroPartecipantiPastaParty * 10;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoContainer}>
            <Img
              src={`${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`}
              width="120"
              height="120"
              alt="Beverino Bike Festival"
              style={logo}
            />
          </Section>

          {/* Titolo */}
          <Heading style={h1}>Iscrizione Confermata! 🎉</Heading>
          
          <Text style={paragraph}>
            Ciao <strong>{nome}</strong>,
          </Text>
          
          <Text style={paragraph}>
            La tua iscrizione al <strong>Beverino Bike Festival 2025</strong> è stata confermata con successo!
            Ti sei iscritto alla <strong>{tipoGaraText}</strong> del 21 Settembre 2025.
          </Text>

          {/* Box riepilogo */}
          <Section style={infoBox}>
            <Heading as="h2" style={h2}>
              Riepilogo Iscrizione
            </Heading>
            
            <Text style={infoRow}>
              <strong>Nome:</strong> {nome} {cognome}
            </Text>
            
            <Text style={infoRow}>
              <strong>Tipo di gara:</strong> {tipoGaraText}
            </Text>
            
            <Text style={infoRow}>
              <strong>Codice registrazione:</strong> <span style={code}>{codiceRegistrazione}</span>
            </Text>
            
            <Hr style={hrLight} />
            
            {/* Dettaglio prezzi */}
            <Text style={infoRow}>
              <strong>Dettaglio pagamento:</strong>
            </Text>
            
            <Section style={priceTable}>
              <Text style={priceRow}>
                <span>{tipoGaraText}:</span>
                <span style={priceValue}>€{prezzoGara}</span>
              </Text>
              
              {includesPastaParty && (
                <Text style={priceRow}>
                  <span>Pasta Party ({numeroPartecipantiPastaParty} {numeroPartecipantiPastaParty === 1 ? 'persona' : 'persone'}):</span>
                  <span style={priceValue}>€{prezzoPastaParty}</span>
                </Text>
              )}
            </Section>
            
            <Hr style={hrLight} />
            
            <Text style={totalRow}>
              <strong>Totale pagato:</strong>
              <span style={totalValue}>€{importoTotale.toFixed(2)}</span>
            </Text>
          </Section>

          {/* Informazioni importanti */}
          <Section style={section}>
            <Heading as="h2" style={h2}>
              Informazioni Importanti
            </Heading>
            
            <Text style={paragraph}>
              <strong>📅 Data:</strong> 21 Settembre 2025
            </Text>
            
            <Text style={paragraph}>
              <strong>📍 Ritrovo:</strong> Centro Sportivo di Beverino, La Spezia
            </Text>
            
            {includesPastaParty && (
              <Text style={paragraph}>
                <strong>🍝 Pasta Party:</strong>
                <br />• Ore 13:00 presso il Centro Sportivo
                <br />• Hai prenotato per {numeroPartecipantiPastaParty} {numeroPartecipantiPastaParty === 1 ? 'persona' : 'persone'}
              </Text>
            )}
          </Section>

          {/* Cosa portare */}
          <Section style={section}>
            <Heading as="h2" style={h2}>
              Cosa Portare
            </Heading>
            
            <Text style={paragraph}>
              • Documento d'identità valido<br />
              • Questo codice di registrazione: <strong>{codiceRegistrazione}</strong><br />
              {tipo_gara === 'ciclistica' ? (
                <>
                  • Bicicletta in buono stato<br />
                  • Casco (OBBLIGATORIO)<br />
                </>
              ) : (
                <>
                  • Abbigliamento sportivo adeguato<br />
                  • Scarpe da running<br />
                </>
              )}
              • Borraccia per l'acqua<br />
            </Text>
          </Section>

          {/* CTA Buttons */}
          {/* da decommentare */}
          {/* <Section style={buttonContainer}>
            <Button
              style={button}
              href={`${process.env.NEXT_PUBLIC_SITE_URL}/programma`}
            >
              Visualizza Programma Completo
            </Button>
          </Section> */}

          {/* da decommentare */}
          {/* <Section style={buttonContainer}>
            <Button
              style={buttonSecondary}
              href={`${process.env.NEXT_PUBLIC_SITE_URL}/faq`}
            >
              Domande Frequenti
            </Button>
          </Section> */}

          {/* Footer */}
          <Hr style={hr} />
          
          <Text style={footer}>
            Ti aspettiamo! Per qualsiasi domanda, contattaci a{' '}
            <Link href="mailto:info@beverinobikefestival.it" style={link}>
              info@beverinobikefestival.it
            </Link>
          </Text>
          
          <Text style={footer}>
            Beverino Bike Festival<br />
            © {new Date().getFullYear()} Tutti i diritti riservati
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '40px',
  maxWidth: '580px',
};

const logoContainer = {
  textAlign: 'center' as const,
  padding: '20px 0',
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#333',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
};

const paragraph = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
  marginBottom: '10px',
  padding: '0 20px',
};

const infoBox = {
  backgroundColor: '#f4f4f4',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px',
};

const infoRow = {
  color: '#333',
  fontSize: '15px',
  lineHeight: '22px',
  marginBottom: '8px',
};

const code = {
  backgroundColor: '#FB6616',
  color: '#fff',
  padding: '4px 8px',
  borderRadius: '4px',
  fontFamily: 'monospace',
  fontSize: '14px',
};

const priceTable = {
  margin: '10px 0',
};

const priceRow = {
  display: 'flex',
  justifyContent: 'space-between',
  color: '#666',
  fontSize: '15px',
  lineHeight: '22px',
  marginBottom: '5px',
};

const priceValue = {
  fontWeight: 'normal' as const,
};

const totalRow = {
  display: 'flex',
  justifyContent: 'space-between',
  color: '#333',
  fontSize: '17px',
  fontWeight: 'bold' as const,
  marginTop: '10px',
};

const totalValue = {
  color: '#FB6616',
  fontSize: '20px',
  fontWeight: 'bold' as const,
};

const section = {
  padding: '0 20px',
  marginBottom: '20px',
};

const button = {
  backgroundColor: '#FB6616',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
  margin: '0 20px',
};

const buttonSecondary = {
  backgroundColor: '#fff',
  border: '1px solid #FB6616',
  borderRadius: '5px',
  color: '#FB6616',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
  margin: '0 20px',
};

const buttonContainer = {
  marginBottom: '16px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const hrLight = {
  borderColor: '#e6ebf1',
  margin: '15px 0',
};

const link = {
  color: '#FB6616',
  textDecoration: 'underline',
};

const italic = {
  fontStyle: 'italic' as const,
  color: '#666',
  fontSize: '14px',
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  marginBottom: '10px',
  padding: '0 20px',
};

export default ConfermaIscrizioneEmail;