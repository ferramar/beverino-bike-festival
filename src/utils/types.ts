import { StrapiMediaAttributes } from "./strapiTypes";

interface StrapiResponseGeneric {
  createdAt: string;
  publishedAt: string;
  updateAt: string;
  documentId: string;
  id: number;
}


export interface SponsorItemComplete extends StrapiResponseGeneric {
  nome: string;
  descrizione: string;
  sito?: string;
  logo: StrapiMediaAttributes;
}

export interface SponsorItem extends StrapiResponseGeneric {
  id: number;
  nome: string;
  descrizione?: string | null;
  sito?: string | null;
  logo?: string;
}