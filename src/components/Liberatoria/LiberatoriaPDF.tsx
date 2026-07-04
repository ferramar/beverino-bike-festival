// src/components/liberatoria/LiberatoriaPDF.tsx
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import { EVENT } from '../../config/event';
import {
  getLiberatoriaCopy,
  buildLuogoEData,
  type OnlineTipoGara,
} from '../../config/liberatorie';

// Registra font personalizzati se necessario
// Font.register({
//   family: 'Roboto',
//   src: '/fonts/Roboto-Regular.ttf'
// });

// Definisci gli stili
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    paddingTop: 102,
    paddingBottom: 40,
    paddingHorizontal: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  pageHeaderFixed: {
    position: 'absolute',
    top: 18,
    left: 40,
    right: 40,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  logo: {
    width: 40,
    height: 40,
  },
  headerTextBlock: {
    marginLeft: 12,
    flex: 1,
  },
  headerOrgName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerOrgLine: {
    fontSize: 10,
    lineHeight: 1.35,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  value: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    flexGrow: 1,
    paddingBottom: 2,
    marginLeft: 5,
  },
  halfRow: {
    width: '48%',
  },
  text: {
    marginBottom: 10,
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  declaration: {
    marginTop: 30,
    marginBottom: 20,
  },
  declarationTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  listItem: {
    marginBottom: 10,
    paddingLeft: 10,
    textAlign: 'justify',
  },
  signature: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginTop: 50,
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 10,
  },
  informativaTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  informativaText: {
    fontSize: 10,
    lineHeight: 1.4,
    textAlign: 'justify',
    marginBottom: 15,
  },
});

const LOGO_SRC =
  process.env.NODE_ENV === 'production'
    ? `${process.env.NEXT_PUBLIC_SITE_URL || EVENT.siteUrl}/logo.png`
    : 'http://localhost:3000/logo.png';

/** Intestazione fissa: logo + dati ASD su ogni pagina (anche overflow). */
function PdfPageHeader() {
  return (
    <View fixed style={styles.pageHeaderFixed}>
      <Image style={styles.logo} src={LOGO_SRC} />
      <View style={styles.headerTextBlock}>
        <Text style={styles.headerOrgName}>A.S.D. Beverino Bikers</Text>
        <Text style={styles.headerOrgLine}>V. S. Maurizio, 24</Text>
        <Text style={styles.headerOrgLine}>19020 Beverino (SP)</Text>
      </View>
    </View>
  );
}

/** Numerazione dinamica su ogni foglio del documento. */
function PdfPageNumber() {
  return (
    <Text
      fixed
      style={styles.pageNumber}
      render={({ pageNumber }) => `${pageNumber}`}
    />
  );
}

/** Evita che label e valore finiscano su pagine diverse. */
function FormRow({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: typeof styles.row | Array<typeof styles.row | Record<string, unknown>>;
}) {
  return (
    <View wrap={false} style={style ? [styles.row, ...(Array.isArray(style) ? style : [style])] : styles.row}>
      {children}
    </View>
  );
}

function FormField({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width?: string;
}) {
  return (
    <View wrap={false} style={width ? { width } : styles.halfRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function FormRowInline({ label, value }: { label: string; value: string }) {
  return (
    <View wrap={false} style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export interface LiberatoriaData {
  nome: string;
  cognome: string;
  luogoNascita: string;
  dataNascita: string;
  comuneResidenza: string;
  residenza: string;
  numeroCivico: string;
  cap: string;
  email: string;
  tipoDocumento: string;
  numeroDocumento: string;
  cittaRilascio: string;
  dataRilascioDocumento: string;
  // Dati genitore (opzionali)
  nomeGenitore?: string;
  cognomeGenitore?: string;
  luogoNascitaGenitore?: string;
  dataNascitaGenitore?: string;
  comuneResidenzaGenitore?: string;
  viaResidenzaGenitore?: string;
  numeroCivicoGenitore?: string;
  capGenitore?: string;
  emailGenitore?: string;
  tipoDocumentoGenitore?: string;
  numeroDocumentoGenitore?: string;
  cittaRilascioGenitore?: string;
  dataRilascioDocumentoGenitore?: string;
  // Dati tutore
  nomeTutore?: string;
  cognomeTutore?: string;
  /** Slug gara per copy variabile (ciclistica | running). */
  tipo_gara?: OnlineTipoGara;
  /** Timestamp accettazione digitale (es. "04/07/2026, 16:30"). */
  accettazioneDigitale?: string;
}

// Funzione helper per creare il documento
export const createLiberatoriaPDF = (data: LiberatoriaData) => {
  const copy = getLiberatoriaCopy(data.tipo_gara || 'ciclistica');

  const compilationDate = data.accettazioneDigitale
    ? data.accettazioneDigitale.split(',')[0].trim()
    : undefined;
  const luogoEData = buildLuogoEData(data.comuneResidenza, compilationDate);
  const luogoEDataGenitore = buildLuogoEData(
    data.comuneResidenzaGenitore || data.comuneResidenza,
    compilationDate
  );

  const formatDate = (dateString: string) => {
    if (!dateString || dateString.trim() === '') return '___________';
    
    try {
      const date = new Date(dateString);
      // Verifica se la data è valida
      if (isNaN(date.getTime())) {
        console.warn('Data non valida ricevuta:', dateString);
        return '___________';
      }
      return date.toLocaleDateString('it-IT');
    } catch (error) {
      console.error('Errore nel parsing della data:', dateString, error);
      return '___________';
    }
  };

  return (
    <Document>
      {/* Pagina 1 - Modulo di iscrizione */}
      <Page size="A4" style={styles.page}>
        <PdfPageHeader />
        <PdfPageNumber />

        {/* Titolo modulo */}
        <Text style={[styles.title, { marginBottom: 20 }]}>
          MODULO DI ISCRIZIONE ALL&apos;EVENTO SPORTIVO &quot;{copy.moduleTitle}&quot; {EVENT.eventDateShort}{'\n'}
          E CONTESTUALE LIBERATORIA PER IL PARTECIPANTE
        </Text>

        {/* Dati partecipante */}
        <Text style={{ marginBottom: 10 }}>Il/la sottoscritto/a</Text>
        
        <View style={styles.section}>
          <FormRow>
            <FormField label="Nome" value={data.nome || '________________________'} />
            <FormField label="Cognome" value={data.cognome || '________________________'} />
          </FormRow>

          <FormRow>
            <FormField label="Nato a" value={data.luogoNascita || '________________________'} />
            <FormField label="il" value={formatDate(data.dataNascita)} />
          </FormRow>

          <FormRowInline
            label="Residente in"
            value={data.comuneResidenza || '________________________'}
          />

          <FormRow>
            <FormField label="Via" value={data.residenza || '________________________'} width="48%" />
            <FormField label="n°" value={data.numeroCivico || '____'} width="25%" />
            <FormField label="C.A.P." value={data.cap || '_________'} width="25%" />
          </FormRow>

          <FormRowInline label="E-mail" value={data.email || '________________________'} />

          <FormRow>
            <FormField
              label="Tipo"
              value={
                data.tipoDocumento === 'cartaIdentita'
                  ? "Carta d'identità"
                  : data.tipoDocumento === 'patente'
                    ? 'Patente'
                    : data.tipoDocumento || '________________________'
              }
            />
            <FormField label="N°" value={data.numeroDocumento || '________________________'} />
          </FormRow>

          <FormRow>
            <FormField label="Luogo" value={data.cittaRilascio || '________________________'} />
            <FormField label="Data di rilascio" value={formatDate(data.dataRilascioDocumento)} />
          </FormRow>
        </View>

        <Text style={[styles.text, { marginTop: 20, marginBottom: 10 }]}>
          con la compilazione del presente modulo
        </Text>
        <Text style={[styles.title, { fontSize: 13 }]}>chiede</Text>
        <Text style={styles.text}>
          l&apos;iscrizione, all&apos;evento sportivo {copy.enrollmentEventName}, che si svolgerà in data {EVENT.eventDateShort} presso {EVENT.location}
        </Text>

        {/* Sezione minore - SEMPRE VISIBILE */}
        <Text style={[styles.label, { marginTop: 20, marginBottom: 10 }]}>
          In caso di minore, indicare i dati di chi ne esercita la potestà genitoriale:
        </Text>
        
        <View style={styles.section}>
          <FormRow>
            <FormField label="Nome" value={data.nomeGenitore || '________________________'} />
            <FormField label="Cognome" value={data.cognomeGenitore || '________________________'} />
          </FormRow>

          <FormRow>
            <FormField label="Nato a" value={data.luogoNascitaGenitore || '________________________'} />
            <FormField label="il" value={formatDate(data.dataNascitaGenitore || '')} />
          </FormRow>

          <FormRowInline
            label="Residente in"
            value={data.comuneResidenzaGenitore || '________________________'}
          />

          <FormRow>
            <FormField label="Via" value={data.viaResidenzaGenitore || '________________________'} width="48%" />
            <FormField label="n°" value={data.numeroCivicoGenitore || '____'} width="25%" />
            <FormField label="C.A.P." value={data.capGenitore || '_________'} width="25%" />
          </FormRow>

          <FormRowInline label="E-mail" value={data.emailGenitore || '________________________'} />

          <FormRow>
            <FormField
              label="Doc. D'Identità"
              value={
                data.tipoDocumentoGenitore === 'cartaIdentita'
                  ? "Carta d'identità"
                  : data.tipoDocumentoGenitore === 'patente'
                    ? 'Patente'
                    : '________________________'
              }
            />
          </FormRow>

          <FormRow>
            <FormField
              label="Tipo"
              value={
                data.tipoDocumentoGenitore === 'cartaIdentita'
                  ? "Carta d'identità"
                  : data.tipoDocumentoGenitore === 'patente'
                    ? 'Patente'
                    : '________________________'
              }
            />
            <FormField label="N°" value={data.numeroDocumentoGenitore || '________________________'} />
          </FormRow>

          <FormRow>
            <FormField label="Luogo" value={data.cittaRilascioGenitore || '________________________'} />
            <FormField
              label="Data di rilascio"
              value={
                data.dataRilascioDocumentoGenitore
                  ? formatDate(data.dataRilascioDocumentoGenitore)
                  : '________________________'
              }
            />
          </FormRow>
        </View>

        {/* Firma */}
        <View wrap={false} style={styles.signature}>
          <View style={styles.signatureBox}>
            <Text>{luogoEData}</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Documento firmato digitalmente</Text>
          </View>
        </View>

      </Page>

      {/* Pagina 2 - Dichiarazione di esonero */}
      <Page size="A4" style={styles.page}>
        <PdfPageHeader />
        <PdfPageNumber />

        <Text style={styles.declarationTitle}>
          DICHIARAZIONE DI ESONERO DI RESPONSABILITA' DEGLI ORGANIZZATORI
        </Text>

        {/* Sezione tutore/accompagnatore */}
        <Text style={[styles.text, { marginBottom: 10, fontStyle: 'italic' }]}>
          Nel caso in cui il genitore del minore non partecipasse al raduno indicare generalità di un tutore maggiorenne che ne partecipi
        </Text>
        
        <FormRow style={{ marginBottom: 30 }}>
          <FormField label="Nome" value={data.nomeTutore || '________________________'} />
          <FormField label="Cognome" value={data.cognomeTutore || '________________________'} />
        </FormRow>

        <View style={styles.section}>
          <Text style={styles.listItem}>
            1) Il sottoscritto e/o L'esercente la potestà genitoriale in caso di minore, dichiara sotto la propria responsabilità, che è in possesso del certificato medico attitudinale attestante l'idoneità alla pratica d'attività sportiva non agonistica, ovvero che è in buono stato di salute, e di esonerare l'organizzazione da ogni responsabilità sia civile che penale relativa e conseguente all'accertamento di suddetta idoneità;
          </Text>

          <Text style={styles.listItem}>
            2) Il sottoscritto e l'esercente la potestà genitoriale in caso di minore, si impegna ad assumere, a pena di esclusione dall'evento, un comportamento conforme ai principi di lealtà e correttezza sportiva in occasione della gara e a non assumere, in nessun caso, comportamenti contrari alla legge e alle norme del regolamento che possano mettere in pericolo la propria o l'altrui incolumità;
          </Text>

          <Text style={styles.listItem}>
            3) Il sottoscritto e/o L'esercente la potestà genitoriale in caso di minore, solleva l'organizzazione, da qualsiasi responsabilità, diretta e indiretta, per eventuali danni materiali e non materiali e/o spese (ivi incluse le spese legali), che dovessero derivare a seguito della partecipazione all'evento, anche in conseguenza del proprio comportamento;
          </Text>

          <Text style={styles.listItem}>
            4) Il sottoscritto e/o L'esercente la potestà genitoriale in caso di minore, infine, con la firma del presente modulo si assume ogni responsabilità che possa derivare dall'esercizio dell'attività sportiva in questione e solleva gli organizzatori tutto il suo staff, il suo Presidente, il suo Consiglio Direttivo, il titolare e/o gestore dell'impianto dove si svolge la manifestazione, da ogni responsabilità civile e penale, anche oggettiva, in conseguenza di infortuni incorsi durante la partecipazione alla manifestazione sportiva e comunque in ogni altra attività alla stessa connessa, a malori che dovessero presentarsi durante l'intera durata dell'evento, o conseguenti all'utilizzo delle infrastrutture, nonché solleva gli organizzatori da ogni responsabilità legata a furti e/o danneggiamenti di qualsiasi oggetto personale manifestatesi nel corso dello svolgimento dell'evento sportivo.
          </Text>
        </View>

        <Text style={[styles.text, { marginTop: 20 }]}>
          Ai sensi e per gli effetti di cui agli artt. 1341 e 1342 del c.c. l'esercente la patria potestà dichiara di aver attentamente esaminato tutte le clausole contenute nella dichiarazione di esonero di responsabilità degli organizzatori e di approvarne specificamente tutti i punti elencati.
        </Text>

        {/* Firma */}
        <View wrap={false} style={styles.signature}>
          <View style={styles.signatureBox}>
            <Text>{luogoEData}</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Documento firmato digitalmente</Text>
          </View>
        </View>

        {/* Sezione Privacy */}
        <View style={[styles.section, { marginTop: 30 }]}>
          <Text style={[styles.label, { fontSize: 12, marginBottom: 10 }]}>
            Autorizzazione al trattamento dei dati personali
          </Text>
          <Text style={styles.text}>
            Preso atto dell'informativa di cui all'art. 13 del decreto legislativo 30 giugno 2003, n. 196, il sottoscritto e/o L'esercente la patria potestà, autorizza il trattamento e la comunicazione alle associazioni organizzatrici dei propri dati personali, per le finalità connesse alla realizzazione dell'evento sportivo e per la eventuale pubblicazione dei risultati della gara. Il Partecipante esprime il consenso ai trattamenti specificati nell'informativa, autorizzando l'invio di materiale informativo relativo a successive manifestazioni o varie iniziative proposte dagli organizzatori e autorizza ad eventuali riprese fotografiche e cinematografiche per la realizzazione di video, bacheche, pubblicazione su carta stampata e web (compreso download).
          </Text>
        </View>

        {/* Firma privacy */}
        <View wrap={false} style={styles.signature}>
          <View style={styles.signatureBox}>
            <Text>{luogoEData}</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Documento firmato digitalmente</Text>
          </View>
        </View>

      </Page>

      {/* Pagina 3 - Liberatoria finale */}
      <Page size="A4" style={styles.page}>
        <PdfPageHeader />
        <PdfPageNumber />

        <Text style={[styles.declarationTitle, { marginBottom: 20 }]}>
          LIBERATORIA DI RESPONSABILITA' PER PARTECIPAZIONE AD EVENTI SPORTIVI
        </Text>

        <Text style={[styles.title, { marginBottom: 15 }]}>DICHIARA E SOTTOSCRIVE</Text>

        <View style={styles.section}>
          <Text style={styles.listItem}>
            - di essere pienamente consapevole degli eventuali rischi corsi durante lo svolgimento delle attività proposte e di essere stato informato dagli organizzatori dell'obbligo di dotarsi di dispositivi di protezione e di sicurezza;
          </Text>

          <Text style={styles.listItem}>
            - essere pienamente consapevole che la propria partecipazione alle attività è volontaria, come è strettamente volontaria e facoltativa ogni azione compiuta durante lo svolgimento delle attività;
          </Text>

          <Text style={styles.listItem}>
            - di assumersi la responsabilità a titolo personale per le conseguenze che dovessero derivare da suddette azioni, sia civilmente che penalmente;
          </Text>

          <Text style={styles.listItem}>
            - di accettare, con l&apos;iscrizione, tutte le condizioni richieste dall&apos;organizzazione pena l&apos;esclusione. Autorizza la pubblicazione di foto (con la propria immagine) effettuate durante il &quot;{copy.photoAuthorizationLabel}&quot; nei mezzi di comunicazione usati dall&apos;organizzazione.
          </Text>

          <Text style={styles.listItem}>
            - Di aver letto, sottoscritto e accettato integralmente il regolamento del evento {copy.regulationLabel}
          </Text>
        </View>

        <Text style={[styles.text, { marginTop: 20 }]}>
          Autorizza inoltre che le stesse vengano diffuse a terzi ed agli sponsor dell'organizzazione anche in occasione di campagne pubblicitarie, fiere, congressi ecc. con qualunque mezzo e supporto lecito, quali ad esempio, cd, dvd, audiovisivi, internet, ecc..
        </Text>

        <Text style={styles.text}>
          La presente autorizzazione viene concessa in piena libertà ed autonomia, senza condizioni o riserve e a titolo completamente gratuito.
        </Text>

        <Text style={styles.text}>
          Il/La sottoscritto/a, preso atto del D.Lgs. 196/03 e s.m.i., autorizza l&apos;organizzazione dell&apos;evento &quot;{copy.privacyOrganizationLabel}&quot; al trattamento dei dati personali che lo riguardano; tale trattamento, cautelato da opportune misure idonee a garantire la sicurezza e la riservatezza dei dati stessi, avverrà esclusivamente per finalità legate all&apos;evento/gara/manifestazione.
        </Text>

        <Text style={[styles.text, { marginTop: 20 }]}>
          In conseguenza di quanto sopra, la/il sottoscritta/o intende assolvere con la presente l'organizzazione, le associazioni ed i suoi organi direttivi, dalle responsabilità che in ogni modo dovessero sorgere in conseguenza della sua partecipazione alle attività per qualsiasi danno subisse alla propria persona o arrecasse a terzi nello svolgimento delle stesse.
        </Text>

        {/* Firma finale */}
        <View wrap={false} style={[styles.signature, { marginTop: 40 }]}>
          <View style={styles.signatureBox}>
            <Text>{luogoEData}</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Documento firmato digitalmente</Text>
          </View>
        </View>

        <Text style={[styles.text, { marginTop: 30, fontStyle: 'italic' }]}>
          Per i partecipanti minori di 18 anni, la liberatoria deve essere obbligatoriamente firmata e compilata dal genitore o da chi ne fa le veci.
        </Text>

        {/* Firma genitore - SEMPRE VISIBILE */}
        <View wrap={false} style={[styles.signature, { marginTop: 30 }]}>
          <View style={styles.signatureBox}>
            <Text>{luogoEDataGenitore}</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Documento firmato digitalmente</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
};