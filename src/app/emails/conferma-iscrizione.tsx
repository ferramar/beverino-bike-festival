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
  includesPastaParty: boolean;
  numeroPartecipantiPastaParty?: number;
  importoTotale: number;
  codiceRegistrazione: string;
}

export const ConfermaIscrizioneEmail = ({
  nome,
  cognome,
  includesPastaParty,
  numeroPartecipantiPastaParty,
  importoTotale,
  codiceRegistrazione,
}: ConfermaIscrizioneEmailProps) => {
  const previewText = `Conferma iscrizione Beverino Bike Festival - ${nome} ${cognome}`;

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
            La tua iscrizione al <strong>Beverino Bike Festival</strong> è stata confermata con successo!
            Siamo entusiasti di averti con noi per questa fantastica giornata all'insegna del ciclismo e del divertimento.
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
              <strong>Codice registrazione:</strong> <span style={code}>{codiceRegistrazione}</span>
            </Text>
            
            {includesPastaParty && (
              <Text style={infoRow}>
                <strong>Pasta Party:</strong> Sì ({numeroPartecipantiPastaParty} {numeroPartecipantiPastaParty === 1 ? 'partecipante' : 'partecipanti'})
              </Text>
            )}
            
            <Hr style={hr} />
            
            <Text style={infoRow}>
              <strong>Importo pagato:</strong> €{importoTotale.toFixed(2)}
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
              <strong>📍 Ritrovo:</strong> Centro Sportivo di Beverino - Via dello Sport, 15
            </Text>
            
            <Text style={paragraph}>
              <strong>⏰ Orari partenza:</strong>
              <br />• Percorso Lungo (80 km): ore 8:30
              <br />• Percorso Medio (50 km): ore 9:00
              <br />• Percorso Corto (30 km): ore 9:30
            </Text>
          </Section>

          {/* Cosa portare */}
          <Section style={section}>
            <Heading as="h2" style={h2}>
              Cosa Portare
            </Heading>
            
            <Text style={paragraph}>
              • Documento d'identità valido<br />
              • Bicicletta in buono stato<br />
              • Casco (OBBLIGATORIO)<br />
            </Text>
          </Section>

          {/* CTA Buttons */}
          <Section style={buttonContainer}>
            <Button
              style={button}
              href={`${process.env.NEXT_PUBLIC_SITE_URL}/programma`}
            >
              Visualizza Programma Completo
            </Button>
          </Section>

          <Section style={buttonContainer}>
            <Button
              style={buttonSecondary}
              href={`${process.env.NEXT_PUBLIC_SITE_URL}/faq`}
            >
              Domande Frequenti
            </Button>
          </Section>

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
  backgroundColor: '#333',
  color: '#fff',
  padding: '4px 8px',
  borderRadius: '4px',
  fontFamily: 'monospace',
  fontSize: '14px',
};

const section = {
  padding: '0 20px',
  marginBottom: '20px',
};

const button = {
  backgroundColor: '#A52D0C',
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
  border: '1px solid #A52D0C',
  borderRadius: '5px',
  color: '#A52D0C',
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

const link = {
  color: '#A52D0C',
  textDecoration: 'underline',
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