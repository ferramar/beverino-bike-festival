/* eslint-disable */
import { FAQItem, FAQStrapi } from "../types/faq";
import { SponsorItem, SponsorStrapi, CategoriaS, CategoriaStrapi } from "../types/sponsor";
import { ConvenzioneItem, CATEGORIE_CONVENZIONI } from '../types/convenzioni';


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
      url: getFullUrl(file.url) || '',
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

const getFullUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${BASE}${url}`;
};

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
      logo: getFullUrl(item.logo?.formats?.thumbnail?.url || item.logo?.url),
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

// convenzioni
export async function getAllConvenzioni(): Promise<ConvenzioneItem[]> {
  try {
    console.log('Chiamando API convenzioni...');
    const response = await fetcher('/api/convenzionis?populate=*&filters[attiva][$eq]=true&sort=ordine:asc,nome:asc');
    
    console.log('Risposta da Strapi:', response);
    
    // In Strapi v5 i dati sono in response.data
    const { data } = response;
    
    if (!data || !Array.isArray(data)) {
      console.log('Nessun dato trovato');
      return [];
    }

    return data.map((item: any) => {
      console.log('Processando convenzione:', item);
      
      // Trova il colore della categoria o usa quello custom
      const categoriaColore = CATEGORIE_CONVENZIONI.find(
        cat => cat.value === item.categoria
      )?.colore || '#A52D0C';
      
      // Gestione URL immagine
      let immagineUrl = undefined;
      
      if (item.immagine) {
        // Verifica diversi formati possibili dell'immagine
        if (typeof item.immagine === 'string') {
          immagineUrl = item.immagine;
        } else if (item.immagine.url) {
          immagineUrl = item.immagine.url;
        } else if (item.immagine.formats?.medium?.url) {
          immagineUrl = item.immagine.formats.medium.url;
        } else if (item.immagine.formats?.small?.url) {
          immagineUrl = item.immagine.formats.small.url;
        }
        
        // Aggiungi BASE URL se necessario
        if (immagineUrl && !immagineUrl.startsWith('http')) {
          const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
          immagineUrl = `${baseUrl}${immagineUrl}`;
        }
      }
      
      return {
        id: item.id,
        nome: item.nome,
        categoria: item.categoria,
        sconto: `${item.percentuale_sconto}%`,
        descrizione: item.descrizione,
        dettagli: item.dettagli_utilizzo,
        immagine: immagineUrl,
        indirizzo: item.indirizzo,
        telefono: item.telefono,
        website: item.website,
        email: item.email,
        validita: item.validita,
        colore: item.colore || categoriaColore,
        ordine: item.ordine || 999,
      };
    });
  } catch (error) {
    console.error('Errore in getAllConvenzioni:', error);
    throw error;
  }
}