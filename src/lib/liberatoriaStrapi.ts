import { renderToBuffer } from '@react-pdf/renderer';
import {
  createLiberatoriaPDF,
  type LiberatoriaData,
} from '@/components/Liberatoria/LiberatoriaPDF';
import { formatAccettazioneDigitale, type OnlineTipoGara } from '@/config/liberatorie';

type StrapiRegistration = {
  id?: number;
  documentId?: string;
  nome: string;
  cognome: string;
  luogoNascita?: string;
  dataNascita?: string;
  comuneResidenza?: string;
  residenza?: string;
  numeroCivico?: string;
  cap?: string;
  email?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  cittaRilascio?: string;
  dataRilascioDocumento?: string;
  dati_genitore?: Record<string, string | null> | null;
  nomeTutore?: string | null;
  cognomeTutore?: string | null;
  tipo_gara?: OnlineTipoGara;
  log_firma_liberatoria?: {
    orario_firmatario?: string;
  } | null;
  codice_registrazione?: string;
  liberatoriaPdfUrl?: string | null;
};

export function registrationToLiberatoriaData(
  registration: StrapiRegistration
): LiberatoriaData {
  const genitore = registration.dati_genitore || {};
  const orario = registration.log_firma_liberatoria?.orario_firmatario;

  return {
    nome: registration.nome,
    cognome: registration.cognome,
    luogoNascita: registration.luogoNascita || '',
    dataNascita: registration.dataNascita || '',
    comuneResidenza: registration.comuneResidenza || '',
    residenza: registration.residenza || '',
    numeroCivico: registration.numeroCivico || '',
    cap: registration.cap || '',
    email: registration.email || '',
    tipoDocumento: registration.tipoDocumento || '',
    numeroDocumento: registration.numeroDocumento || '',
    cittaRilascio: registration.cittaRilascio || '',
    dataRilascioDocumento: registration.dataRilascioDocumento || '',
    nomeGenitore: genitore.nome || undefined,
    cognomeGenitore: genitore.cognome || undefined,
    luogoNascitaGenitore: genitore.luogoNascita || undefined,
    dataNascitaGenitore: genitore.dataNascita || undefined,
    comuneResidenzaGenitore: genitore.comuneResidenza || undefined,
    viaResidenzaGenitore: genitore.viaResidenza || undefined,
    numeroCivicoGenitore: genitore.numeroCivico || undefined,
    capGenitore: genitore.cap || undefined,
    emailGenitore: genitore.email || undefined,
    tipoDocumentoGenitore: genitore.tipoDocumento || undefined,
    numeroDocumentoGenitore: genitore.numeroDocumento || undefined,
    cittaRilascioGenitore: genitore.cittaRilascio || undefined,
    dataRilascioDocumentoGenitore: genitore.dataRilascioDocumento || undefined,
    nomeTutore: registration.nomeTutore || undefined,
    cognomeTutore: registration.cognomeTutore || undefined,
    tipo_gara: registration.tipo_gara,
    accettazioneDigitale: orario
      ? formatAccettazioneDigitale(new Date(orario))
      : undefined,
  };
}

export async function uploadPdfToStrapi(
  pdfBuffer: Uint8Array,
  fileName: string
): Promise<string | null> {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const formData = new FormData();
  const blob = new Blob([new Uint8Array(pdfBuffer)], { type: 'application/pdf' });
  formData.append('files', blob, fileName);
  formData.append('folder', 'liberatorie');

  const uploadResponse = await fetch(`${strapiUrl}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!uploadResponse.ok) {
    console.error('Errore upload liberatoria su Strapi:', await uploadResponse.text());
    return null;
  }

  const uploadResult = await uploadResponse.json();
  const uploadedFile = uploadResult?.[0];
  if (!uploadedFile?.url) return null;

  return uploadedFile.url.startsWith('http')
    ? uploadedFile.url
    : `${strapiUrl}${uploadedFile.url}`;
}

/** Genera e carica la liberatoria PDF solo se non esiste già su Strapi. */
export async function generateAndSaveLiberatoriaForRegistration(
  registration: StrapiRegistration
): Promise<string | null> {
  if (registration.liberatoriaPdfUrl) {
    return registration.liberatoriaPdfUrl;
  }

  const data = registrationToLiberatoriaData(registration);
  const pdfBuffer = await renderToBuffer(createLiberatoriaPDF(data));
  const safeName = `${data.nome}_${data.cognome}`.replace(/\s+/g, '_');
  const fileName = `liberatoria_${safeName}_${registration.codice_registrazione || Date.now()}.pdf`;

  return uploadPdfToStrapi(new Uint8Array(pdfBuffer), fileName);
}
