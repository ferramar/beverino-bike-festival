// src/components/liberatoria/LiberatoriaPDF.tsx
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';

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
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
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

export interface LiberatoriaData {
  nome: string;
  cognome: string;
  luogoNascita: string;
  dataNascita: string;
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
  provinciaGenitore?: string;
}

// Funzione helper per creare il documento
export const createLiberatoriaPDF = (data: LiberatoriaData) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '___________';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT');
  };

  return (
    <Document>
      {/* Pagina 1 - Modulo di iscrizione */}
      <Page size="A4" style={styles.page}>
        {/* Header con logo */}
        <View style={styles.header}>
          {/* Se hai un logo, decommentalo */}
          <Image 
            style={styles.logo} 
            src={process.env.NODE_ENV === 'production' 
              ? `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`
              : 'http://localhost:3000/logo.png'
            } 
          />
          <Text style={styles.title}>A.S.D. Beverino Bikers</Text>
          <Text>V. S. Maurizio, 24</Text>
          <Text>19020 Beverino (SP)</Text>
        </View>

        {/* Titolo modulo */}
        <Text style={[styles.title, { marginBottom: 20 }]}>
          MODULO DI ISCRIZIONE ALL'EVENTO SPORTIVO "BEVERINO BIKE FESTIVAL" 21/09/2025{'\n'}
          E CONTESTUALE LIBERATORIA PER IL PARTECIPANTE
        </Text>

        {/* Dati partecipante */}
        <Text style={{ marginBottom: 10 }}>Il/la sottoscritto/a</Text>
        
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.halfRow}>
              <Text style={styles.label}>Nome</Text>
              <Text style={styles.value}>{data.nome || '________________________'}</Text>
            </View>
            <View style={styles.halfRow}>
              <Text style={styles.label}>Cognome</Text>
              <Text style={styles.value}>{data.cognome || '________________________'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfRow}>
              <Text style={styles.label}>Nato a</Text>
              <Text style={styles.value}>{data.luogoNascita || '________________________'}</Text>
            </View>
            <View style={styles.halfRow}>
              <Text style={styles.label}>il</Text>
              <Text style={styles.value}>{formatDate(data.dataNascita)}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Residente in</Text>
            <Text style={styles.value}>{data.residenza || '________________________'}</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.halfRow}>
              <Text style={styles.label}>Via</Text>
              <Text style={styles.value}>{data.residenza || '________________________'}</Text>
            </View>
            <View style={{ width: '25%' }}>
              <Text style={styles.label}>n°</Text>
              <Text style={styles.value}>{data.numeroCivico || '____'}</Text>
            </View>
            <View style={{ width: '25%' }}>
              <Text style={styles.label}>C.A.P.</Text>
              <Text style={styles.value}>{data.cap || '_________'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>E-mail</Text>
            <Text style={styles.value}>{data.email || '________________________'}</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.halfRow}>
              <Text style={styles.label}>Tipo</Text>
              <Text style={styles.value}>{data.tipoDocumento === 'cartaIdentita' ? "Carta d'identità" : data.tipoDocumento === 'patente' ? 'Patente' : data.tipoDocumento || '________________________'}</Text>
            </View>
            <View style={styles.halfRow}>
              <Text style={styles.label}>N°</Text>
              <Text style={styles.value}>{data.numeroDocumento || '________________________'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfRow}>
              <Text style={styles.label}>Luogo</Text>
              <Text style={styles.value}>{data.cittaRilascio || '________________________'}</Text>
            </View>
            <View style={styles.halfRow}>
              <Text style={styles.label}>Data di rilascio</Text>
              <Text style={styles.value}>{formatDate(data.dataRilascioDocumento)}</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.text, { marginTop: 20, marginBottom: 10 }]}>
          con la compilazione del presente modulo
        </Text>
        <Text style={[styles.title, { fontSize: 13 }]}>chiede</Text>
        <Text style={styles.text}>
          l'iscrizione, all'evento sportivo Beverino Bike Festival, che si svolgerà in data 21/09/2025 presso Beverino (SP)
        </Text>

        {/* Sezione minore - SEMPRE VISIBILE */}
        <Text style={[styles.label, { marginTop: 20, marginBottom: 10 }]}>
          In caso di minore, indicare i dati di chi ne esercita la potestà genitoriale:
        </Text>
        
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.halfRow}>
              <Text style={styles.label}>Nome</Text>
              <Text style={styles.value}>{data.nomeGenitore || '________________________'}</Text>
            </View>
            <View style={styles.halfRow}>
              <Text style={styles.label}>Cognome</Text>
              <Text style={styles.value}>{data.cognomeGenitore || '________________________'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfRow}>
              <Text style={styles.label}>Nato a</Text>
              <Text style={styles.value}>{data.luogoNascitaGenitore || '________________________'}</Text>
            </View>
            <View style={styles.halfRow}>
              <Text style={styles.label}>il</Text>
              <Text style={styles.value}>{formatDate(data.dataNascitaGenitore || '')}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Residente in</Text>
            <Text style={styles.value}>{data.comuneResidenzaGenitore || '________________________'}</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.halfRow}>
              <Text style={styles.label}>Via</Text>
              <Text style={styles.value}>{'________________________'}</Text>
            </View>
            <View style={{ width: '25%' }}>
              <Text style={styles.label}>n°</Text>
              <Text style={styles.value}>{'____'}</Text>
            </View>
            <View style={{ width: '25%' }}>
              <Text style={styles.label}>C.A.P.</Text>
              <Text style={styles.value}>{'_________'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>E-mail</Text>
            <Text style={styles.value}>{'________________________'}</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.halfRow}>
              <Text style={styles.label}>Doc. D'Identità</Text>
              <Text style={styles.value}>{'________________________'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfRow}>
              <Text style={styles.label}>Tipo</Text>
              <Text style={styles.value}>{'________________________'}</Text>
            </View>
            <View style={styles.halfRow}>
              <Text style={styles.label}>N°</Text>
              <Text style={styles.value}>{'________________________'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfRow}>
              <Text style={styles.label}>Luogo</Text>
              <Text style={styles.value}>{'________________________'}</Text>
            </View>
            <View style={styles.halfRow}>
              <Text style={styles.label}>Data di rilascio</Text>
              <Text style={styles.value}>{'________________________'}</Text>
            </View>
          </View>
        </View>

        {/* Firma */}
        <View style={styles.signature}>
          <View style={styles.signatureBox}>
            <Text>Luogo e Data, _____________________</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Documento firmato digitalmente</Text>
          </View>
        </View>

        <Text style={styles.pageNumber}>1</Text>
      </Page>

      {/* Pagina 2 - Dichiarazione di esonero */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.declarationTitle}>
          DICHIARAZIONE DI ESONERO DI RESPONSABILITA' DEGLI ORGANIZZATORI
        </Text>

        {/* Sezione tutore/accompagnatore */}
        <Text style={[styles.text, { marginBottom: 10, fontStyle: 'italic' }]}>
          Nel caso in cui il genitore del minore non partecipasse al raduno indicare generalità di un tutore maggiorenne che ne partecipi
        </Text>
        
        <View style={[styles.row, { marginBottom: 30 }]}>
          <View style={styles.halfRow}>
            <Text style={styles.label}>Nome</Text>
            <Text style={styles.value}>{'________________________'}</Text>
          </View>
          <View style={styles.halfRow}>
            <Text style={styles.label}>Cognome</Text>
            <Text style={styles.value}>{'________________________'}</Text>
          </View>
        </View>

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
        <View style={styles.signature}>
          <View style={styles.signatureBox}>
            <Text>Luogo e Data _______________</Text>
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
        <View style={styles.signature}>
          <View style={styles.signatureBox}>
            <Text>Luogo e Data _______________</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Documento firmato digitalmente</Text>
          </View>
        </View>

        <Text style={styles.pageNumber}>2</Text>
      </Page>

      {/* Pagina 3 - Liberatoria finale */}
      <Page size="A4" style={styles.page}>
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
            - di accettare, con l'iscrizione, tutte le condizioni richieste dall'organizzazione pena l'esclusione. Autorizza la pubblicazione di foto (con la propria immagine) effettuate durante il "Beverino Bike Festival 21/09/2025" nei mezzi di comunicazione usati dall'organizzazione.
          </Text>

          <Text style={styles.listItem}>
            - Di aver letto, sottoscritto e accettato integralmente il regolamento del evento B.B.F. 2025
          </Text>
        </View>

        <Text style={[styles.text, { marginTop: 20 }]}>
          Autorizza inoltre che le stesse vengano diffuse a terzi ed agli sponsor dell'organizzazione anche in occasione di campagne pubblicitarie, fiere, congressi ecc. con qualunque mezzo e supporto lecito, quali ad esempio, cd, dvd, audiovisivi, internet, ecc..
        </Text>

        <Text style={styles.text}>
          La presente autorizzazione viene concessa in piena libertà ed autonomia, senza condizioni o riserve e a titolo completamente gratuito.
        </Text>

        <Text style={styles.text}>
          Il/La sottoscritto/a, preso atto del D.Lgs. 196/03 e s.m.i., autorizza l'organizzazione dell'evento "Beverino Bike Festival 21/09/2025" al trattamento dei dati personali che lo riguardano; tale trattamento, cautelato da opportune misure idonee a garantire la sicurezza e la riservatezza dei dati stessi, avverrà esclusivamente per finalità legate all'evento/gara/manifestazione.
        </Text>

        <Text style={[styles.text, { marginTop: 20 }]}>
          In conseguenza di quanto sopra, la/il sottoscritta/o intende assolvere con la presente l'organizzazione, le associazioni ed i suoi organi direttivi, dalle responsabilità che in ogni modo dovessero sorgere in conseguenza della sua partecipazione alle attività per qualsiasi danno subisse alla propria persona o arrecasse a terzi nello svolgimento delle stesse.
        </Text>

        {/* Firma finale */}
        <View style={[styles.signature, { marginTop: 40 }]}>
          <View style={styles.signatureBox}>
            <Text>Luogo e Data _______________</Text>
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
        <View style={[styles.signature, { marginTop: 30 }]}>
          <View style={styles.signatureBox}>
            <Text>Luogo e Data _______________</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Documento firmato digitalmente</Text>
          </View>
        </View>

        <Text style={styles.pageNumber}>3</Text>
      </Page>
    </Document>
  );
};