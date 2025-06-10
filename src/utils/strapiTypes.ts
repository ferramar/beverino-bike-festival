/* Tipizzazioni generiche per i media restituiti da Strapi */

export interface StrapiMediaFormat {
  ext: string;           // estensione (".jpg", ".png", ecc.)
  url: string;           // URL relativo o assoluto della risorsa
  hash: string;          // hash generato da Strapi
  mime: string;          // MIME type (es. "image/jpeg", "image/png")
  name: string;          // nome del file senza estensione
  path: null | string;   // generalmente null per filesystem locali
  size: number;          // dimensione in kilobyte (es. 1.23)
  width?: number;        // larghezza in pixel (per le immagini)
  height?: number;       // altezza in pixel (per le immagini)
}

export interface StrapiMediaAttributes {
  name: string;                       // nome originale del file con estensione
  alternativeText: string | null;     // testo alternativo (per accessibility)
  caption: string | null;             // didascalia associata al media
  width: number | null;               // larghezza originale (pixel), se image
  height: number | null;              // altezza originale (pixel), se image
  formats: {                           // eventuali versioni ridotte/thumbnail
    thumbnail?: StrapiMediaFormat;     // miniatura
    small?: StrapiMediaFormat;         // versione small
    medium?: StrapiMediaFormat;        // versione medium
    large?: StrapiMediaFormat;         // versione large
    [key: string]: StrapiMediaFormat | undefined;
  } | null;
  hash: string;                       // hash del file
  ext: string;                        // estensione (".jpg", ".png", ecc.)
  mime: string;                       // MIME type
  size: number;                       // dimensione in kilobyte (es. 1.23)
  url: string;                        // URL relativo (o assoluto se è già completo)
  previewUrl: string | null;          // URL di preview, se generato
  provider: string;                   // “local” o nome del provider cloud (es. "strapi-provider-cloudinary")
  provider_metadata: any | null;      // meta-info specifico del provider (es. public_id, resource_type, ecc.)
  createdAt: string;                  // data di creazione ISO8601
  updatedAt: string;                  // data di ultima modifica ISO8601
}

export interface StrapiMediaData {
  id: number;
  attributes: StrapiMediaAttributes;
}

// Se un singolo campo media è “populated” (ad esempio con `populate=logo`), Strapi risponde così:
export interface StrapiSingleMediaResponse {
  data: StrapiMediaData | null;
}

// Se il campo media è multiple (array), Strapi risponde così:
export interface StrapiMultipleMediaResponse {
  data: StrapiMediaData[];
}

// Strapi, per ogni entità (es. Sponsor, Edition, Product…), restituisce concettualmente un “entity” che contiene `data: { id, attributes }`
// Esempio di una singola entità popolata con media:
export interface StrapiEntityWithMedia<TAttributes> {
  id: number;
  attributes: TAttributes & {
    // se usi un singolo file:
    media?: StrapiSingleMediaResponse;
    // se usi array di file:
    mediaMultiple?: StrapiMultipleMediaResponse;
    // ...e altri campi custom di quell’entità
  };
}

export interface StrapiCollectionResponse<TEntity> {
  data: TEntity[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  } | null;
}

// ------------------------
// Esempio d’uso concreto:
// ------------------------

// Supponiamo di avere un Content Type “Sponsor” in Strapi, con attributi:
// - name: string
// - description: string
// - logo: media singolo

export interface SponsorAttributes {
  name: string;
  description?: string | null;
  website?: string | null;
  logo: StrapiSingleMediaResponse; // singolo file
}

export type SponsorEntity = StrapiEntityWithMedia<SponsorAttributes>;

// Se andiamo a chiamare GET /sponsors?populate=logo, otteniamo:
export type SponsorCollectionResponse = StrapiCollectionResponse<SponsorEntity>;


// Allo stesso modo, se avessi un Content Type “GalleryItem” con media multipli:
export interface GalleryItemAttributes {
  title: string;
  media: StrapiMultipleMediaResponse;
  // altri campi…
}

export type GalleryItemEntity = StrapiEntityWithMedia<GalleryItemAttributes>;

// GET /gallery-items?populate=media
export type GalleryItemCollectionResponse = StrapiCollectionResponse<GalleryItemEntity>;
