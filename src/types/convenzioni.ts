// src/types/convenzione.ts

export interface ConvenzioneItem {
  id: number;
  nome: string;
  categoria: string;
  sconto: string; // es. "15%"
  descrizione: string;
  dettagli: string;
  immagine?: string;
  indirizzo?: string;
  telefono?: string;
  website?: string;
  email?: string;
  validita?: string;
  colore: string;
  ordine: number;
}

// Categorie predefinite per le convenzioni
export const CATEGORIE_CONVENZIONI = [
  { value: 'alloggio', label: 'Alloggio', colore: '#4CAF50' },
  { value: 'ristorazione', label: 'Ristorazione', colore: '#E91E63' },
  { value: 'negozio', label: 'Negozio', colore: '#FF6B35' },
  { value: 'wellness', label: 'Wellness', colore: '#9C27B0' },
  { value: 'servizi', label: 'Servizi', colore: '#2196F3' },
  { value: 'altro', label: 'Altro', colore: '#607D8B' },
] as const;