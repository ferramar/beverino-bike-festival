// types/faq.ts

// Tipo per i blocchi di contenuto di Strapi
export type StrapiBlock = {
  type: 'paragraph' | 'list' | 'heading' | 'quote';
  children: Array<{
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    code?: boolean;
  }>;
  format?: 'ordered' | 'unordered';
  level?: number;
};

// Tipo per FAQ come viene da Strapi
export type FAQStrapi = {
  id: number;
  domanda: string;
  risposta: StrapiBlock[];
  ordine: number;
  attivo: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
};

// Tipo per FAQ nell'applicazione
export type FAQItem = {
  id: number;
  domanda: string;
  risposta: StrapiBlock[];
  ordine: number;
  attivo: boolean;
};