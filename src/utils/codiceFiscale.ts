import CodiceFiscale from 'codice-fiscale-js';

export interface DecodedCodiceFiscale {
  dataNascita: string;
  luogoNascita: string;
  sesso: 'M' | 'F';
  valid: boolean;
}

export function normalizeCodiceFiscale(value: string): string {
  return value.replace(/\s/g, '').toUpperCase();
}

export function isValidCodiceFiscale(value: string): boolean {
  const cf = normalizeCodiceFiscale(value);
  if (cf.length !== 16) return false;
  try {
    return CodiceFiscale.check(cf);
  } catch {
    return false;
  }
}

export function decodeCodiceFiscale(value: string): DecodedCodiceFiscale | null {
  const cf = normalizeCodiceFiscale(value);
  if (!isValidCodiceFiscale(cf)) return null;

  try {
    const decoded = CodiceFiscale.computeInverse(cf);
    const luogo =
      decoded.birthplaceProvincia && decoded.birthplace
        ? `${decoded.birthplace} (${decoded.birthplaceProvincia})`
        : decoded.birthplace || '';

    return {
      dataNascita: decoded.birthday,
      luogoNascita: luogo,
      sesso: decoded.gender === 'F' ? 'F' : 'M',
      valid: true,
    };
  } catch {
    return null;
  }
}
