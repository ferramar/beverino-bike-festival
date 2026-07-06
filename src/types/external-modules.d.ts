declare module 'codice-fiscale-js' {
  interface ICodiceFiscaleObject {
    name: string;
    surname: string;
    gender: 'M' | 'F';
    day: number;
    year: number;
    month: number;
    birthday: string;
    birthplace: string;
    birthplaceProvincia: string;
    cf: string;
  }

  export default class CodiceFiscale {
    constructor(codiceFiscale: string);
    static check(codiceFiscale: string): boolean;
    static computeInverse(codiceFiscale: string): ICodiceFiscaleObject;
  }
}

declare module 'comuni-json/comuni.json' {
  interface ComuneJson {
    nome: string;
    sigla: string;
    cap?: string[];
  }
  const comuni: ComuneJson[];
  export default comuni;
}
