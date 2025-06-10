/* eslint-disable */

import { StrapiMediaAttributes } from "./strapiTypes";
import { SponsorItem, SponsorItemComplete } from "./types";

export interface MediaFile {
  id: number;
  name: string;
  mime: string;
  url: string;
  formats?: {
    thumbnail?: { url: string };
  };
}

export interface EditionRecord {
  id: number;
  edizione: number;
  media: MediaFile[];
}

export interface StrapiResponse {
  data: EditionRecord[];
  meta: any;
}

export interface SponsorAttributes {
  nome: string;
  descrizione?: string;
  logo?: string;
  sito?: string;
}

type MediaItem = {
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

// “appiattisci” i dati in un array di MediaItem per il front-end
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
  const { data } = await fetcher('/api/sponsors?populate=logo');
  if (!data || !Array.isArray(data)) return []

  return data.map((item: SponsorItemComplete) => {
    return {
      ...item,
      logo: item && item.logo && item.logo.formats?.thumbnail?.url
        ? (item.logo.formats.thumbnail.url.startsWith('http')
            ? item.logo.formats.thumbnail.url
            : `${BASE}${item.logo.formats.thumbnail.url}`)
            : undefined,
    }
  })
}
