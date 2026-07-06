export const DATA_SUB_STEP_COUNT = 3;

export const ANAGRAFICA_FIELDS = [
  'codiceFiscale',
  'nome',
  'cognome',
  'luogoNascita',
  'dataNascita',
] as const;

export const RESIDENZA_FIELDS = [
  'comuneResidenza',
  'residenza',
  'numeroCivico',
  'cap',
  'email',
] as const;

export const DOCUMENTO_FIELDS = [
  'tipoDocumento',
  'numeroDocumento',
  'cittaRilascio',
  'dataRilascioDocumento',
] as const;

export const GENITORE_FIELDS = [
  'nomeGenitore',
  'cognomeGenitore',
  'luogoNascitaGenitore',
  'dataNascitaGenitore',
  'comuneResidenzaGenitore',
  'viaResidenzaGenitore',
  'numeroCivicoGenitore',
  'capGenitore',
  'emailGenitore',
  'tipoDocumentoGenitore',
  'numeroDocumentoGenitore',
  'cittaRilascioGenitore',
  'dataRilascioDocumentoGenitore',
] as const;

export function getFieldsForDataSubStep(
  subStep: number,
  isMinor: boolean
): string[] {
  if (subStep === 0) return [...ANAGRAFICA_FIELDS];
  if (subStep === 1) return [...RESIDENZA_FIELDS];
  if (subStep === 2) {
    return isMinor ? [...DOCUMENTO_FIELDS, ...GENITORE_FIELDS] : [...DOCUMENTO_FIELDS];
  }
  return [];
}

export function isMinorFromBirthDate(birthDate?: string): boolean {
  if (!birthDate) return false;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age < 18;
}
