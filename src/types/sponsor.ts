// types.ts - aggiungi/aggiorna questi tipi

import { StrapiMediaAttributes } from "../utils/strapiTypes";

export interface CategoriaS {
  id: number;
  nome: string;
}

export interface SponsorItem {
  id: number;
  nome: string;
  descrizione?: string;
  logo?: string;
  sito?: string;
  principale?: boolean;
  categorie_sponsors?: CategoriaS[];
}

// Struttura completa sponsor da Strapi v5
export interface SponsorStrapi {
  id: number;
  documentId: string;
  nome: string;
  descrizione?: string;
  sito?: string;
  principale: boolean;
  logo?: StrapiMediaAttributes;
  categorie_sponsors: CategoriaS[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Struttura categoria da Strapi v5
export interface CategoriaStrapi {
  id: number;
  documentId: string;
  nome: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}