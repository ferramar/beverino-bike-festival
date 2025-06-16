export interface CloudinaryFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  provider_metadata: {
    public_id: string;
    resource_type: string;
  };
}

export interface MediaItem {
  id: number;
  title?: string;
  description?: string;
  type: 'image' | 'video';
  editionYear: number;
  url: string;
  thumbnailUrl?: string;
  mediumUrl?: string;
  formats?: {
    large?: CloudinaryFormat;
    medium?: CloudinaryFormat;
    small?: CloudinaryFormat;
    thumbnail?: CloudinaryFormat;
  };
  provider_metadata?: {
    public_id: string;
    resource_type: string;
  };
  createdAt: string;
  updatedAt: string;
}