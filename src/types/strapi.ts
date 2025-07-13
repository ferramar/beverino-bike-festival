export interface MediaItem {
  id: number;
  title?: string;
  description?: string;
  type: 'image' | 'video';
  editionYear: number;
  url: string;
  thumbnailUrl?: string;
  mediumUrl?: string;
  provider_metadata?: {
    public_id: string;
    resource_type: string;
  };
  createdAt: string;
  updatedAt: string;
}