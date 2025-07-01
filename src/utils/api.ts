/* eslint-disable */
import { FAQItem, FAQStrapi } from "../types/faq";
import { SponsorItem, SponsorStrapi, CategoriaS, CategoriaStrapi } from "../types/sponsor";

type MediaItem = {
  title: string;
  id: number;
  url: string;
  type: 'image' | 'video';
  editionYear: number;
  thumbnailUrl?: string;
};

const BASE = process.env.NEXT_PUBLIC_STRAPI_URL;

// fetcher generico per Strapi
export const fetcher = (url: string) =>
  fetch(`${BASE}${url}`).then(res => res.json());

export async function getAllMedia(): Promise<MediaItem[]> {
  const { data } = await fetcher('/api/media-edizionis?populate=media');
  return data.flatMap((record: any) =>
    record.media.map((file: any) => ({
      id: file.id,
      url: file.url.startsWith('http')
        ? file.url
        : `${BASE}${file.url}`,
      type: file.mime.startsWith('image/') ? 'image' : 'video',
      editionYear: record.edizione,
      thumbnailUrl: file.formats?.thumbnail?.url
        ? (file.formats.thumbnail.url.startsWith('http')
            ? file.formats.thumbnail.url
            : `${BASE}${file.formats.thumbnail.url}`)
        : undefined,
    }))
  );
}

export async function getAllSponsors(): Promise<SponsorItem[]> {
  const { data } = await fetcher('/api/sponsors?populate=*');
  if (!data || !Array.isArray(data)) return []

  return data.map((item: SponsorStrapi): SponsorItem => {
    return {
      id: item.id,
      nome: item.nome,
      descrizione: item.descrizione,
      sito: item.sito,
      principale: item.principale || false,
      logo: item.logo?.formats?.thumbnail?.url || item.logo?.url,
      categorie_sponsors: item.categorie_sponsors || []
    }
  })
}

export async function getAllSponsorsWithCategories(): Promise<SponsorItem[]> {
  const { data } = await fetcher('/api/sponsors?populate=*&sort=principale:desc,nome:asc');
  if (!data || !Array.isArray(data)) return []

  return data.map((item: SponsorStrapi): SponsorItem => {
    return {
      id: item.id,
      nome: item.nome,
      descrizione: item.descrizione,
      sito: item.sito,
      principale: item.principale || false,
      logo: item.logo?.formats?.thumbnail?.url || item.logo?.url,
      categorie_sponsors: item.categorie_sponsors?.map((cat: CategoriaS) => ({
        id: cat.id,
        nome: cat.nome
      })) || []
    }
  })
}

export async function getAllSponsorCategories(): Promise<CategoriaS[]> {
  const { data } = await fetcher('/api/categorie-sponsors?sort=nome:asc');
  if (!data || !Array.isArray(data)) return []

  return data.map((item: CategoriaStrapi): CategoriaS => ({
    id: item.id,
    nome: item.nome
  }))
}

export async function getAllFAQs(): Promise<FAQItem[]> {
  const { data } = await fetcher('/api/faqs?filters[attivo][$eq]=true&sort=ordine:asc');
  if (!data || !Array.isArray(data)) return [];

  return data.map((item: FAQStrapi): FAQItem => ({
    id: item.id,
    domanda: item.domanda,
    risposta: item.risposta,
    ordine: item.ordine,
    attivo: item.attivo,
  }));
}