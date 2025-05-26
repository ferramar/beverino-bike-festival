/* eslint-disable */

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
  fetch(`${BASE}${url}`).then(res => res.json() as Promise<StrapiResponse>);

// “appiattisci” i dati in un array di MediaItem per il front-end
export async function getAllMedia(): Promise<MediaItem[]> {
  const { data } = await fetcher('/api/media-edizionis?populate=media');
  return data.flatMap(record =>
    record.media.map(file => ({
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
